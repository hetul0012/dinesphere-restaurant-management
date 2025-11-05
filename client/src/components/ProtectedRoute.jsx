import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, booting } = useAuth();

  if (booting) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (roles?.length) {
    const role = (user.role || "").toLowerCase();
    if (!roles.map(r => r.toLowerCase()).includes(role)) {
      return <Navigate to="/" replace />;
    }
  }
  return children;
}
