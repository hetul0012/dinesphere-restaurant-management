import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export function issueToken(user) {
  return jwt.sign(
    { _id: user._id, email: user.email, role: user.role || "user" },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}


export function attachUser(req, _res, next) {
  const raw = req.cookies?.token;
  if (!raw) return next();
  try {
    req.user = jwt.verify(raw, JWT_SECRET);
  } catch {
    
  }
  next();
}


export function authRequired(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}


export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
}
