import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tablesAPI, reservationsAPI } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Reservations() {
  const { user } = useAuth() || { user: null };
  const navigate = useNavigate();

  // form fields
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [time, setTime] = useState("19:00");
  const [notes, setNotes] = useState("");

  // availability
  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // keep email in sync after user logs in
  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  // refresh availability
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!date || !time || !guests) {
        setTables([]);
        setSelectedTableId(null);
        return;
      }
      try {
        setLoading(true);
        setErr("");
        const res = await tablesAPI.availability({ date, time, guests });
        const list = Array.isArray(res?.tables) ? res.tables : Array.isArray(res) ? res : [];
        if (!alive) return;

        const normalized = list.map((t, i) => ({
          _id: t._id || t.id || String(i + 1),
          name: t.name || t.code || `T-${i + 1}`,
          label: t.label || t.name || t.code || `T-${i + 1}`,
          status: t.status || "available",
          seats: t.seats || t.capacity || null,
        }));

        setTables(normalized);
        if (selectedTableId && !normalized.find(t => t._id === selectedTableId && t.status === "available")) {
          setSelectedTableId(null);
        }
      } catch (e) {
        if (!alive) return;
        setErr(e.message || "Could not load availability.");
        setTables([]);
        setSelectedTableId(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, time, guests]);

  const availableCount = useMemo(
    () => tables.filter(t => t.status === "available").length,
    [tables]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!selectedTableId) {
      setErr("Please choose a table.");
      return;
    }

    try {
      const payload = {
        email,
        phone,
        guests: Number(guests),
        date,
        time,
        tableId: selectedTableId,
        notes: notes?.trim() || undefined,
      };
      const created = await reservationsAPI.create(payload);
      const r = created?.reservation || created || {};
      const rid = r._id || r.id;
      if (rid) navigate(`/reservations/confirm/${rid}`, { replace: true });
      else navigate("/account/reservations", { replace: true });
    } catch (e) {
      const m = (e?.message || "").toLowerCase();
      // Catch all common auth responses from your server
      if (
        m.includes("401") ||
        m.includes("unauthorized") ||
        m.includes("authentication required") ||
        m.includes("not authenticated") ||
        m.includes("login")
      ) {
        navigate("/login?next=/reservations", { replace: true });
        return;
      }
      setErr(e.message || "Could not create reservation.");
    }
  }

  return (
    <section className="section">
      <div className="container">
        <h1>Reservations</h1>

        <div className="grid-3" style={{ gridTemplateColumns: "1.2fr 1fr" }}>
          {/* LEFT: form */}
          <form className="card" onSubmit={handleSubmit} style={{ gridColumn: "1 / 2" }}>
            <div className="card-pad">
              <div className="stack-16">
                <div>
                  <label className="muted">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="muted">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="(555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="grid-3" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                  <div>
                    <label className="muted">Guests*</label>
                    <select
                      className="form-control"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="muted">Date*</label>
                    <input
                      type="date"
                      className="form-control"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="muted">Time*</label>
                    <input
                      type="time"
                      className="form-control"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="muted">Special Requests</label>
                  <textarea
                    rows={4}
                    className="form-control"
                    placeholder="Birthday, allergies, high chair…"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn primary" disabled={loading || !selectedTableId}>
                  {loading ? "Checking…" : selectedTableId ? "Confirm Reservation" : "Pick a table to continue"}
                </button>

                {!!err && <div className="alert error">{err}</div>}
              </div>
            </div>
          </form>

          {/* RIGHT: table picker */}
          <aside className="card" style={{ gridColumn: "2 / 3" }}>
            <div className="card-pad">
              <h3>Select Your Table</h3>

              {loading && <div className="muted">Loading availability…</div>}

              {!loading && (
                <>
                  {tables.length === 0 ? (
                    <div className="muted">No tables data yet. Pick a date/time above.</div>
                  ) : (
                    <>
                      <div className="chips" style={{ marginTop: 8 }}>
                        {tables.map((t) => {
                          const isSelected = selectedTableId === t._id;
                          const disabled = t.status !== "available";
                          const label = t.label || t.name;
                          return (
                            <button
                              key={t._id}
                              type="button"
                              className={`chip ${isSelected ? "active" : ""}`}
                              onClick={() => !disabled && setSelectedTableId(t._id)}
                              disabled={disabled}
                              title={t.seats ? `${label} · ${t.seats} seats` : label}
                              style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>

                      {selectedTableId && (
                        <div className="muted" style={{ marginTop: 10 }}>
                          Selected table: <strong>{tables.find(t => t._id === selectedTableId)?.label}</strong>
                        </div>
                      )}

                      <div className="muted" style={{ marginTop: 10 }}>
                        {availableCount} available at {time} on {date}
                      </div>
                    </>
                  )}
                </>
              )}

              <div className="info-block mt-24">
                <strong>Restaurant Information</strong>
                <p className="muted" style={{ marginTop: 6 }}>
                  Address 123 College Ave, Downtown City
                  <br />
                  Hours Mon–Thu 11–10 • Fri–Sat 11–11 • Sun 11–9
                  <br />
                  Phone (555) 123-4567 • Email hello@dinesphere.com
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
