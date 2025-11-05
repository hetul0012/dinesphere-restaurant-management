import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, setError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("");
    try {
      await register({ name, email, password });
    } catch (err) {
      const msg = err?.message || "Registration failed";
      setStatus(msg);
      setError?.(msg);
    }
  }

  return (
    <div className="container py-5">
      <div style={{ maxWidth: 420 }}>
        <h4 className="mb-3">Create Account</h4>
        {status && <div className="alert alert-warning py-2 mb-3">{status}</div>}
        <form onSubmit={onSubmit} className="vstack gap-3">
          <div>
            <label className="form-label">Full Name</label>
            <input className="form-control" value={name}
                   onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input className="form-control" value={email}
                   onChange={e => setEmail(e.target.value)} type="email" required />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input className="form-control" value={password}
                   onChange={e => setPassword(e.target.value)} type="password" required />
          </div>
          <button className="btn btn-warning fw-semibold" type="submit">Register</button>
        </form>
        <div className="mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
