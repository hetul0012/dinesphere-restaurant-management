import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const FALLBACK = "/images/menu/mains.jpg";

export default function Dish() {
  const { id } = useParams();
  const nav = useNavigate();
  const [dish, setDish] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    menuAPI
      .get(id)
      .then((d) => alive && setDish(d))
      .catch((e) => alive && setErr(e?.message || "Not Found"));
    return () => (alive = false);
  }, [id]);

  return (
    <div className="container py-4">
      <button className="btn btn-sm btn-outline-dark mb-3" onClick={() => nav(-1)}>
        ×
      </button>

      {err && <div className="alert alert-danger">Could not load dish.</div>}
      {!err && !dish && <div className="alert alert-secondary">Loading…</div>}

      {!!dish && (
        <div className="row g-4">
          <div className="col-12 col-md-6">
            <img
              src={imgUrl(dish.image) || FALLBACK}
              alt={dish.name}
              onError={(e) => (e.currentTarget.src = FALLBACK)}
              style={{ width: "100%", height: 360, objectFit: "cover" }}
            />
          </div>
          <div className="col-12 col-md-6">
            <h3 className="mb-2">{dish.name}</h3>
            {typeof dish.price === "number" && (
              <p className="fw-bold">${dish.price.toFixed(2)}</p>
            )}
            {!!dish.description && (
              <p className="text-muted">{dish.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
