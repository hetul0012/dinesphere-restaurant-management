import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { menuAPI } from "../lib/api";


function apiOrigin() {
  const api = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";
  return api.replace(/\/api\/?$/, "");
}


function imgUrl(src) {
  if (!src) return "";
  if (/^https?:\/\//i.test(src)) return src;
  const base = apiOrigin();
 
  return `${base}${src.startsWith("/uploads") ? src : `/uploads/${src}`}`;
}

// Per-dish local images (by name keywords)
const NAME_IMAGE = [
  { re: /paneer/i, path: "/images/menu/paneer.png" },
  { re: /salmon/i, path: "/images/menu/salmon.png" },
  { re: /chicken/i, path: "/images/menu/chicken.png" },
  { re: /tenderloin|steak/i, path: "/images/menu/tenderloin.png" },
  { re: /pasta|alfredo/i, path: "/images/menu/pasta.png" },
  { re: /risotto/i, path: "/images/menu/risotto.png" },
  { re: /lava.?cake|chocolate/i, path: "/images/menu/lava_cake.png" },
  { re: /lemonade|drink/i, path: "/images/menu/lemonade.png" },
];

// Category fallbacks
const CAT_PLACEHOLDER = {
  starters: "/images/menu/starters.jpg",
  mains: "/images/menu/mains.jpg",
  desserts: "/images/menu/desserts.jpg",
  drinks: "/images/menu/drinks.jpg",
  default: "/images/menu/mains.jpg",
};


function localFallbackFor(item, activeKey) {
  const name = item?.name || "";
  for (const m of NAME_IMAGE) if (m.re.test(name)) return m.path;


  const slug =
    (typeof item?.category === "object" ? item?.category?.slug : item?.category) ||
    activeKey ||
    "";
  return CAT_PLACEHOLDER[slug] || CAT_PLACEHOLDER.default;
}

const CATEGORIES = [
  { key: "", label: "All" },
  { key: "starters", label: "Starters" },
  { key: "mains", label: "Mains" },
  { key: "desserts", label: "Desserts" },
  { key: "drinks", label: "Drinks" },
];

/* ---------- component ---------- */

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeKey = searchParams.get("category") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [featured, setFeatured] = useState([]);

  
  function setCategory(key) {
    if (!key) setSearchParams({}, { replace: true });
    else setSearchParams({ category: key }, { replace: true });
  }

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    const q = activeKey ? `?category=${encodeURIComponent(activeKey)}` : "";
    menuAPI
      .list(q)
      .then((data) => {
        if (!alive) return;
        const arr = Array.isArray(data?.items) ? data.items : data;
        setItems(arr || []);
      })
      .catch((e) => alive && setError(e?.message || "Failed to load menu"))
      .finally(() => alive && setLoading(false));

    // featured
    menuAPI
      .list("?featured=true")
      .then((data) => {
        if (!alive) return;
        const arr = Array.isArray(data?.items) ? data.items : data;
        setFeatured(arr || []);
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, [activeKey]);

  const activeLabel = useMemo(
    () => CATEGORIES.find((c) => c.key === activeKey)?.label || "All Dishes",
    [activeKey]
  );

  
  function handleImgError(e, item) {
    const fallback = localFallbackFor(item, activeKey);
    if (e.currentTarget.dataset.fallbackApplied) return;
    e.currentTarget.dataset.fallbackApplied = "1";
    e.currentTarget.src = fallback;
    e.currentTarget.style.display = "";
  }

  return (
    <div className="container py-5">
      <h1 className="mb-3">Our Menu</h1>
      <p className="text-muted">
        Discover our carefully crafted dishes made with seasonal ingredients.
      </p>

      {/* Category chips */}
      <div className="d-flex gap-2 flex-wrap mb-4">
        {CATEGORIES.map((c) => (
          <button
            key={c.key || "all"}
            type="button"
            onClick={() => setCategory(c.key)}
            className={`btn btn-sm rounded-pill ${
              (c.key || "") === activeKey ? "btn-warning" : "btn-outline-dark"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Seasonal CTA */}
      <section className="mb-4">
        <h5 className="fw-semibold">Seasonal Chef Specials</h5>
        <p className="text-muted mb-2">
          Experience our limited-time seasonal creations crafted with the finest
          local ingredients
        </p>
        <Link to="/reservations" className="btn btn-warning fw-semibold">
          Make Reservation
        </Link>
      </section>

      {/* Featured */}
      {featured?.length > 0 && (
        <>
          <h4 className="mt-4 mb-3">Featured Dishes</h4>
          <div className="vstack gap-3 mb-5">
            {featured.map((it) => (
              <article key={it._id} className="card border-0 shadow-sm">
                <img
                  src={imgUrl(it.image) || localFallbackFor(it, activeKey)}
                  alt={it?.name || "Dish"}
                  onError={(e) => handleImgError(e, it)}
                  style={{ width: "100%", height: 320, objectFit: "cover" }}
                />
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="card-title mb-2">{it?.name || "Dish"}</h5>
                    {typeof it?.price === "number" && (
                      <div className="fw-bold">${it.price.toFixed(2)}</div>
                    )}
                  </div>
                  {!!it?.description && (
                    <p className="card-text text-muted mb-3">
                      {it.description}
                    </p>
                  )}
                  <Link
                    className="btn btn-outline-dark btn-sm"
                    to={`/menu/${it._id}`}
                  >
                    View details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {/* Category list */}
      <h4 className="mt-2 mb-3">{activeLabel}</h4>

      {loading && <div className="alert alert-secondary">Loading…</div>}
      {!!error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="row g-4">
          {items.map((it) => (
            <div key={it._id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <img
                  src={imgUrl(it.image) || localFallbackFor(it, activeKey)}
                  alt={it?.name || "Dish"}
                  onError={(e) => handleImgError(e, it)}
                  style={{ width: "100%", height: 220, objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between">
                    <h6 className="mb-2">{it?.name || "Dish"}</h6>
                    {typeof it?.price === "number" && (
                      <span className="fw-bold">${it.price.toFixed(2)}</span>
                    )}
                  </div>

                  {!!it?.description && (
                    <p className="text-muted flex-grow-1 mb-3">
                      {it.description}
                    </p>
                  )}

                  <Link
                    className="btn btn-outline-dark btn-sm mt-auto"
                    to={`/menu/${it._id}`}
                  >
                    View details
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {!items.length && (
            <div className="col-12">
              <div className="alert alert-secondary">
                No dishes in this category yet.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
