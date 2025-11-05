import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const onLogout = () => {
    logout();
    setOpen(false);
    nav("/");
  };

  return (
    <div className="nav-wrap">
      <div className="nav-inner">
        <Link className="brand" to="/" onClick={() => setOpen(false)}>
          DineSphere
        </Link>

       
        <button
          className="hamburger"
          aria-label="Toggle navigation"
          onClick={() => setOpen(o => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Links */}
        <nav className={`nav ${open ? "open" : ""}`}>
          <NavLink className="nav-link" to="/" onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink className="nav-link" to="/menu" onClick={() => setOpen(false)}>Menu</NavLink>
          <NavLink className="nav-link" to="/reservations" onClick={() => setOpen(false)}>Reservations</NavLink>
          <NavLink className="nav-link" to="/contact" onClick={() => setOpen(false)}>Contact</NavLink>
          {user?.role === "admin" && (
            <NavLink className="nav-link" to="/admin" onClick={() => setOpen(false)}>Admin</NavLink>
          )}
        </nav>

        <div className="nav-actions">
          {!user ? (
            <>
              <Link className="btn ghost" to="/login" onClick={() => setOpen(false)}>Login</Link>
              <Link className="btn" to="/register" onClick={() => setOpen(false)}>Register</Link>
            </>
          ) : (
            <>
              <Link className="btn ghost" to="/account" onClick={() => setOpen(false)}>Account</Link>
              <button className="btn" onClick={onLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
