import { Router } from "express";
import User from "../models/User.js";
import { signUser } from "../utils/jwt.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already used" });

    const u = new User({ name, email, role: "customer" });
    await u.setPassword(password);
    await u.save();

    const token = signUser(u);
    res
      .cookie("token", token, { httpOnly: true, sameSite: "lax" })
      .json({ id: u._id, name: u.name, email: u.email, role: u.role });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const u = await User.findOne({ email });
    if (!u) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await u.comparePassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signUser(u);
    res
      .cookie("token", token, { httpOnly: true, sameSite: "lax" })
      .json({ id: u._id, name: u.name, email: u.email, role: u.role });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/auth/me
router.get("/me", authRequired, async (req, res) => {
  res.json(req.user);
});

// POST /api/auth/logout
router.post("/logout", (_req, res) => {
  res.clearCookie("token").json({ ok: true });
});

export default router;
