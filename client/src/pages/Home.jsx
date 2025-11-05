import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { menuAPI } from "../lib/api";
import { MenuCard } from "./_parts";

export default function Home() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await menuAPI.list({ featured: true });
        setItems(data || []);
      } catch (e) {
        setErr("Could not load featured dishes.");
      }
    })();
  }, []);

  return (
    <>
      {/* -------- Hero Section -------- */}
      <section className="section hero">
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
          <div>
            <span className="kicker">Contemporary Indian & Continental</span>
            <h1>Smart Restaurant Management. Effortless Dining.</h1>
            <p>
              Reserve online, explore our seasonal menu, and enjoy a seamless dining experience crafted by our chefs.
            </p>
            <div className="actions">
              <Link to="/reservations" className="btn">Book a Table</Link>
              <Link to="/menu" className="btn ghost">View Menu</Link>
            </div>
          </div>
        </div>
      </section>

      {/* -------- Featured Dishes -------- */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Featured Dishes</h2>
          {err && <div className="badge bad" style={{ marginBottom: 12 }}>{err}</div>}
          <div className="grid menu">
            {items.map((i) => <MenuCard key={i.id || i._id} item={i} />)}
            {!items.length && (
              <div className="muted">No featured dishes yet. Please add some in Admin → Menu.</div>
            )}
          </div>
        </div>
      </section>

      {/* -------- Why DineSphere -------- */}
      <section className="section">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: "center" }}>Why DineSphere</h2>
          <p className="muted" style={{ textAlign: "center", marginBottom: 20 }}>
            Experience dining redefined
          </p>

          <div className="tiles three">
            <div className="tile">
              <div className="icon-badge" aria-hidden>🥗</div>
              <h4>Fresh Ingredients</h4>
              <p className="muted">
                Sourced locally and prepared daily for the freshest quality we serve.
              </p>
            </div>

            <div className="tile">
              <div className="icon-badge" aria-hidden>⚡</div>
              <h4>Quick Reservations</h4>
              <p className="muted">
                Book your table instantly with our seamless online reservation system.
              </p>
            </div>

            <div className="tile">
              <div className="icon-badge" aria-hidden>🌟</div>
              <h4>Cozy Ambience</h4>
              <p className="muted">
                Warm, inviting atmosphere perfect for intimate dinners & celebrations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -------- Testimonials -------- */}
      <section className="section">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: "center" }}>What Our Guests Say</h2>

          <div className="grid testimonials">
            <div className="card testimonial">
              <div className="stars" aria-label="5 out of 5">★★★★★</div>
              <p>
                “Absolutely incredible dining experience! The service was impeccable and the food was outstanding.”
              </p>
              <div className="t-meta">
                <strong>Hetul Suthar</strong>
                <span className="muted">Local Foodie</span>
              </div>
            </div>

            <div className="card testimonial">
              <div className="stars" aria-label="5 out of 5">★★★★★</div>
              <p>
                “The ambiance is perfect for date nights. The reservations process was smooth and fast.”
              </p>
              <div className="t-meta">
                <strong>Saumil Patel</strong>
                <span className="muted">Regular Customer</span>
              </div>
            </div>

            <div className="card testimonial">
              <div className="stars" aria-label="5 out of 5">★★★★★</div>
              <p>
                “Outstanding service and delicious food! The best place in town for our go-to weekend plans.”
              </p>
              <div className="t-meta">
                <strong>Avni</strong>
                <span className="muted">Food Lover</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
