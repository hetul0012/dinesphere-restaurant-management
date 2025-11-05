import { useParams, Link } from "react-router-dom";

export default function Confirm() {
  const { id } = useParams();
  return (
    <section className="section">
      <div className="container center-col">
        <div className="panel confirm-card">
          <div className="big-emoji">✅</div>
          <h2>Reservation Confirmed!</h2>
          <p className="muted">Your reservation #{id} has been successfully made.</p>
          <div className="row-center gap-12 mt-12">
            <Link className="btn" to="/account/reservations">View My Reservations</Link>
            <Link className="btn ghost" to="/">Back to Home</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
