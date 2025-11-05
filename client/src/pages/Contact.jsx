import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
   
    setSent(true);
  }

  return (
    <section className="section">
      <div className="container">
        <h1>Contact</h1>

        <div className="grid-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {/* Form */}
          <form className="card" onSubmit={onSubmit} style={{ gridColumn: "1 / 2" }}>
            <div className="card-pad">
              <div className="stack-16">
                <div>
                  <label className="muted">Your Name</label>
                  <input
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                  />
                </div>
                <div>
                  <label className="muted">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="muted">Message*</label>
                  <textarea
                    rows={6}
                    className="form-control"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help?"
                    required
                  />
                </div>
                <button className="btn primary" type="submit">Send Message</button>
                {sent && <div className="alert success">Thanks! We’ll get back to you shortly.</div>}
              </div>
            </div>
          </form>

          {/* Map + address */}
          <aside className="card" style={{ gridColumn: "2 / 3" }}>
            <div className="card-pad">
              <h3>Map</h3>
              <div className="map-embed rounded-16 shadow-soft" style={{ overflow: "hidden", marginTop: 8 }}>
                <iframe
                  title="DineSphere Location"
                  width="100%"
                  height="340"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={
                 
                    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23093.466717843603!2d-79.39971427904612!3d43.65475620049683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4cb34d27310bd%3A0xba15d20622070393!2sDowntown%20Toronto%2C%20Toronto%2C%20ON!5e0!3m2!1sen!2sca!4v1762292594299!5m2!1sen!2sca"
                  }
                />
              </div>

              <div className="info-block mt-24">
                <strong>Visit Our Restaurant</strong>
                <p className="muted" style={{ marginTop: 6 }}>
                  123 College Ave, Downtown
                  <br />
                  Mon–Thu 11–10 • Fri–Sat 11–11 • Sun 11–9
                  <br />
                  (555) 555-1234 • hello@dinesphere.com
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
