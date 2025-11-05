import { verifyToken } from "../utils/jwt.js";

export function authRequired(req, res, next) {
  const token = req.cookies?.token;
  const decoded = token ? verifyToken(token) : null;
  if (!decoded) return res.status(401).json({ error: "Unauthorized" });
  req.user = decoded;
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}
