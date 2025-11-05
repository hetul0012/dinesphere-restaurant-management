import jwt from "jsonwebtoken";

export function signUser(u) {
  return jwt.sign(
    { id: u._id, role: u.role, email: u.email, name: u.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}
