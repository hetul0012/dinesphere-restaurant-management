import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  return (
    <section className="section">
      <div className="container">
        <div className="panel">
          <h3>Profile Information</h3>
          <div className="muted mt-8">Name: {user?.name || "—"}</div>
          <div className="muted">Email: {user?.email || "—"}</div>
          <div className="muted">Role: {user?.role || "customer"}</div>
        </div>
      </div>
    </section>
  );
}
