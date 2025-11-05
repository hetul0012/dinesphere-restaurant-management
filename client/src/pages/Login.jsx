import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, setError } = useAuth();
  const [email, setEmail] = useState("admin@dinesphere.com");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(""); 

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("");
    try {
      await login({ email, password });
    } catch (err) {
      const msg = err?.message || "Login failed";
      setStatus(msg);
      setError?.(msg);
    }
  }

  return (
    <div className="container py-5">
      <div style={{ maxWidth: 420 }}>
        <h4 className="mb-3">Welcome Back</h4>
        {status && <div className="alert alert-warning py-2 mb-3">{status}</div>}
        <form onSubmit={onSubmit} className="vstack gap-3">
          <div>
            <label className="form-label">Email Address</label>
            <input className="form-control" value={email}
                   onChange={e => setEmail(e.target.value)} type="email" required />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input className="form-control" value={password}
                   onChange={e => setPassword(e.target.value)} type="password" required />
          </div>
          <button className="btn btn-warning fw-semibold" type="submit">Login</button>
        </form>
        <div className="mt-3">
          Don’t have an account? <Link to="/register">Create an Account</Link>
        </div>
      </div>
    </div>
  );
}
