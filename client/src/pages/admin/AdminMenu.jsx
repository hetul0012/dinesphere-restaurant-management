import { useEffect, useMemo, useState } from "react";
import { menuAPI } from "../../lib/api";

const CATEGORIES = [
  { key: "", label: "All" },
  { key: "starters", label: "Starters" },
  { key: "mains", label: "Mains" },
  { key: "desserts", label: "Desserts" },
  { key: "drinks", label: "Drinks" },
];


function catKey(cat) {
  if (!cat) return "";
  if (typeof cat === "string") return cat.toLowerCase();
  
  return (cat.slug || cat.name || cat._id || "").toLowerCase();
}
function catLabel(cat) {
  const key = catKey(cat);
  return CATEGORIES.find((c) => c.key === key)?.label || (key || "All");
}

const emptyForm = {
  name: "",
  price: "",
  category: "starters", 
  description: "",
  image: "",
  featured: false,
};

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  // edit/create state
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // ---------- load ----------
  async function load() {
    setLoading(true);
    setErr("");
    try {
      const q = category ? { category } : "";
      const data = await menuAPI.list(q);
      setItems(Array.isArray(data?.items) ? data.items : data);
    } catch (e) {
      setErr(e.message || "Failed to load dishes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
   
  }, [category]);

  // ---------- editor ----------
  function startCreate() {
    setEditId(null);
    setForm(emptyForm);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function startEdit(item) {
    setEditId(item._id);
    setForm({
      name: item.name || "",
      price: item.price ?? "",
      category: catKey(item.category) || "starters",
      description: item.description || "",
      image: item.image || "",
      featured: !!item.featured,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function cancelEdit() {
    setEditId(null);
    setForm(emptyForm);
  }
  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function normalizeImage(img) {
    if (!img) return "";
    if (/^https?:\/\//i.test(img)) return img;
    if (img.startsWith("/uploads/")) return img;
    return `/images/menu/${img.replace(/^\/+/, "")}`;
  }

  // ---------- submit ----------
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setErr("");

    const body = {
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category, 
      description: form.description.trim(),
      image: normalizeImage(form.image.trim()),
      featured: !!form.featured,
    };

    try {
      if (editId) {
        await menuAPI.update(editId, body);
      } else {
        await menuAPI.create(body);
      }
      await load();
      cancelEdit();
    } catch (e) {
      setErr(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!id) return;
    if (!confirm("Delete this dish?")) return;
    setErr("");
    try {
      await menuAPI.delete(id);
      setItems((prev) => prev.filter((x) => x._id !== id));
    } catch (e) {
      setErr(e.message || "Delete failed");
    }
  }

  const visible = useMemo(() => {
    if (!category) return items;
    return items.filter((it) => catKey(it.category) === category);
  }, [items, category]);

  return (
    <div className="container py-4">
      <h2 className="mb-3">Admin · Menu</h2>

      {/* category filter */}
      <div className="d-flex gap-2 flex-wrap mb-3">
        {CATEGORIES.map((c) => (
          <button
            key={c.key || "all"}
            className={`btn btn-sm rounded-pill ${
              (c.key || "") === category ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setCategory(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {!!err && <div className="alert alert-danger mb-3">API {err}</div>}

      {/* editor */}
      <form onSubmit={handleSubmit} className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">{editId ? "Edit Dish" : "Create Dish"}</h5>
            {editId ? (
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={cancelEdit}>
                Cancel edit
              </button>
            ) : (
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={startCreate}>
                New
              </button>
            )}
          </div>

          <div className="row g-3 align-items-center">
            <div className="col-md-3">
              <label className="form-label">Name</label>
              <input
                name="name"
                className="form-control"
                value={form.name}
                onChange={onChange}
                required
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Price</label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                value={form.price}
                onChange={onChange}
                required
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={form.category}
                onChange={onChange}
              >
                {CATEGORIES.filter((c) => c.key).map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Image (URL or filename)</label>
              <input
                name="image"
                className="form-control"
                placeholder="paneer.png or /uploads/paneer.png"
                value={form.image}
                onChange={onChange}
              />
              <div className="form-text">
                Files in <code>public/images/menu</code> can be referenced by filename.
              </div>
            </div>

            <div className="col-md-2">
              <div className="form-check mt-4 pt-2">
                <input
                  id="featured"
                  name="featured"
                  type="checkbox"
                  className="form-check-input"
                  checked={form.featured}
                  onChange={onChange}
                />
                <label className="form-check-label" htmlFor="featured">
                  Featured
                </label>
              </div>
            </div>

            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows={2}
                value={form.description}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="mt-3">
            <button className="btn btn-warning" disabled={saving}>
              {saving ? "Saving…" : editId ? "Update Dish" : "Create Dish"}
            </button>
          </div>
        </div>
      </form>

      {/* list */}
      {loading ? (
        <div className="alert alert-secondary">Loading…</div>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th style={{ width: 80 }}>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th style={{ width: 120 }}>Price</th>
                <th style={{ width: 160 }}></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((it) => (
                <tr key={it._id}>
                  <td>
                    {it.image ? (
                      <img
                        src={it.image}
                        alt={it.name}
                        style={{ width: 56, height: 40, objectFit: "cover", borderRadius: 6 }}
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>{it.name}</td>
                  <td>
                    <span className="badge text-bg-light border">{catLabel(it.category)}</span>
                  </td>
                  <td>${Number(it.price).toFixed(2)}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-dark me-2" onClick={() => startEdit(it)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-warning" onClick={() => handleDelete(it._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!visible.length && (
                <tr>
                  <td colSpan={5} className="text-muted">
                    No dishes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
