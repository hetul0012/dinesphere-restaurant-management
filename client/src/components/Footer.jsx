export default function Footer() {
  return (
    <footer className="footer">
      <div className="cols">
        <div>
          <h3>DineSphere</h3>
          <p className="muted">
            Perfect blend of contemporary Indian & Continental cuisine.
          </p>
        </div>
        <div>
          <h4>Contact Info</h4>
          <div className="muted">123 College Ave, Downtown</div>
          <div className="muted">(555) 555-1234</div>
          <div className="muted">hello@dinesphere.com</div>
        </div>
        <div>
          <h4>Hours</h4>
          <div className="muted">Mon–Thu 11–10</div>
          <div className="muted">Fri–Sat 11–11</div>
          <div className="muted">Sun 11–9</div>
        </div>
      </div>
    </footer>
  );
}
