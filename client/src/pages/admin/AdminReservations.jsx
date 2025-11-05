import { useEffect, useState } from "react";
import { reservationsAPI } from "../../lib/api";

export default function AdminReservations() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError("");
      const data = await reservationsAPI.list();
      const list = Array.isArray(data?.items) ? data.items : data;
      setRows(list);
    } catch (e) {
      setError(e.message || "Failed to load reservations");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  
  async function setStatus(id, status) {
    try {
      await reservationsAPI.update(id, { status });
      await load();
    } catch (e) {
      alert(e.message || "Failed to update");
    }
  }

  return (
    <div className="container py-4">
      <h1 className="mb-3">Admin · Reservations</h1>

      {!!error && <div className="alert alert-danger">API: {error}</div>}
      {loading && <div className="alert alert-secondary">Loading…</div>}

      {!loading && !rows.length && (
        <div className="alert alert-light">No reservations.</div>
      )}

      {!loading && !!rows.length && (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Date/Time</th>
                <th>Table</th>
                <th>Guests</th>
                <th>Status</th>
                <th style={{width: 160}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id}>
                  <td>
                    <div className="fw-semibold">{r.name || r.guestName || "—"}</div>
                    <div className="text-muted small">{r.email || r.guestEmail || ""}</div>
                  </td>
                  <td>
                    <div>{r.date || r.resDate || "—"} {r.time || r.resTime || ""}</div>
                  </td>
                  <td>{r.tableNumber ?? r.table ?? "—"}</td>
                  <td>{r.guests ?? r.partySize ?? "—"}</td>
                  <td>
                    <span className="badge text-bg-light">{r.status || "pending"}</span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => setStatus(r._id, "confirmed")}
                      >
                        Confirm
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setStatus(r._id, "cancelled")}
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
