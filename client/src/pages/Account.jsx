import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Account() {
  const { user } = useAuth();
  return (
    <section className="section">
      <div className="container account-grid">
        <aside className="panel">
          <h3 className="muted">My Account</h3>
          <nav className="stack">
            <Link className="tile link" to="/account"><strong>Dashboard</strong></Link>
            <Link className="tile link" to="/account/reservations"><strong>My Reservations</strong></Link>
            <Link className="tile link" to="/account/profile"><strong>Account Details</strong></Link>
          </nav>
        </aside>

        <div className="panel">
          <h2>Welcome, {user?.name || user?.email}</h2>
          <p className="muted">Manage your reservations and profile here.</p>

          <div className="tiles three mt-16">
            <div className="tile">
              <h4>Menu</h4>
              <p className="muted">Browse our featured dishes.</p>
              <Link className="btn mt-8" to="/menu">Open</Link>
            </div>
            <div className="tile">
              <h4>Reservations</h4>
              <p className="muted">View or modify your bookings.</p>
              <Link className="btn mt-8" to="/account/reservations">Open</Link>
            </div>
            <div className="tile">
              <h4>Profile</h4>
              <p className="muted">Update your personal info.</p>
              <Link className="btn mt-8" to="/account/profile">Open</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
