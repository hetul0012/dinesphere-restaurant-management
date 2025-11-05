import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../lib/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

 
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await authAPI.me();   
        if (!cancelled) setUser(me?.user || me);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setBooting(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setError("");
    const res = await authAPI.login({ email, password });
    setUser(res?.user || res);

    const role = (res?.user?.role || res?.role || "user").toLowerCase();
    if (role === "admin") navigate("/admin/dashboard", { replace: true });
    else navigate("/account", { replace: true });
  }, [navigate]);

  const register = useCallback(async ({ name, email, password }) => {
    setError("");
    const res = await authAPI.register({ name, email, password }); // returns {user}
    setUser(res?.user || res);
    navigate("/account", { replace: true });
  }, [navigate]);

  const logout = useCallback(async () => {
    try { await authAPI.logout(); } catch {}
    setUser(null);
    navigate("/", { replace: true });
  }, [navigate]);

  const value = { user, setUser, booting, error, setError, login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
