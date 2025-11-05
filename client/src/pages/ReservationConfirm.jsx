import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { reservationsAPI } from "../lib/api";


export default function ReservationConfirm() {
  const { id } = useParams();
  const [r, setR] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await reservationsAPI.get(id);
        const resv = data?.reservation || data;
        if (alive) setR(resv);
      } catch (e) {
        if (alive) setErr("Could not load reservation.");
      }
    })();
    return () => { alive = false; };
  }, [id]);

  if (err) {
    return (
      <div className="section">
        <div className="container">
          <div className="alert error">{err}</div>
        </div>
      </div>
    );
  }
  if (!r) {
    return (
      <div className="section">
        <div className="container">Loading…</div>
      </div>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="card pad-24">
          <h1>Reservation Confirmed 🎉</h1>
          <p className="muted">Thanks! Your table has been booked.</p>

          <div className="grid-2 mt-16">
            <div>
              <h3>Details</h3>
              <ul className="list">
                {!!r.name && <li><strong>Name:</strong> {r.name}</li>}
                {!!r.email && <li><strong>Email:</strong> {r.email}</li>}
                {!!r.phone && <li><strong>Phone:</strong> {r.phone}</li>}
                {!!r.guests && <li><strong>Guests:</strong> {r.guests}</li>}
                {!!r.date && <li><strong>Date:</strong> {r.date}</li>}
                {!!r.time && <li><strong>Time:</strong> {r.time}</li>}
                <li><strong>Table:</strong> {r.table?.name || r.table?.code || r.table?.number || "Assigned on arrival"}</li>
                {!!r.notes && <li><strong>Notes:</strong> {r.notes}</li>}
              </ul>
            </div>
          </div>

          <div className="mt-20" style={{ display: "flex", gap: 10 }}>
            <Link to="/" className="btn">Back to Home</Link>
            <Link to="/reservations" className="btn ghost">Make Another Reservation</Link>
            <Link to="/account/reservations" className="btn ghost">View My Reservations</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
