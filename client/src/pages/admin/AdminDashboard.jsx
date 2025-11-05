import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="section">
      <h1 className="section__title">Admin Dashboard</h1>

      <div className="tiles" style={{ gridTemplateColumns: "repeat(3,minmax(0,1fr))" }}>
        <div className="tile">
          <h3>Menu</h3>
          <p>Create, update, and remove dishes.</p>
          <Link className="btn mt" to="/admin/menu">Open</Link>
        </div>

        <div className="tile">
          <h3>Reservations</h3>
          <p>Manage all reservations and table status.</p>
          <Link className="btn mt" to="/admin/reservations">Open</Link>
        </div>

        <div className="tile">
          <h3>Tables</h3>
          <p>CRUD for tables and capacity.</p>
          <Link className="btn mt" to="/admin/tables">Open</Link>
        </div>
      </div>
    </div>
  );
}
