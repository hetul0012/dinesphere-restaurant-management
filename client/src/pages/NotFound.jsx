import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container center-col">
        <h1>404</h1>
        <p className="muted">Page not found.</p>
        <Link to="/" className="btn mt-12">Back Home</Link>
      </div>
    </section>
  );
}
