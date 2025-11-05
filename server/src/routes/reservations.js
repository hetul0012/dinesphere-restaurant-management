import { Router } from "express";
import Reservation from "../models/Reservation.js";
import Table from "../models/Table.js";
import { authRequired } from "../utils/auth.js";

const router = Router();

// list 
router.get("/", async (req, res) => {
  const q = {};
  if (req.query.date) q.date = req.query.date;
  if (req.query.time) q.time = req.query.time;
  const items = await Reservation.find(q).lean();
  res.json(items);
});

// NEW
router.get("/:id", async (req, res) => {
  const r = await Reservation.findById(req.params.id)
    .populate("table")
    .lean();
  if (!r) return res.status(404).json({ error: "Not found" });
  res.json(r);
});

// UPDATED
router.post("/", authRequired, async (req, res) => {
  const { name, email, phone, guests, date, time, table, notes } = req.body;


  if (!date || !time || !table || !guests)
    return res.status(400).json({ error: "Missing fields" });

 
  const t = await Table.findById(table);
  if (!t) return res.status(400).json({ error: "Invalid table" });

  const clash = await Reservation.findOne({ table, date, time });
  if (clash) return res.status(409).json({ error: "Table already reserved" });

  const r = await Reservation.create({
    user: req.user.id,
    name, email, phone, guests, date, time, table, notes
  });

  res.status(201).json({ ok: true, id: r._id });
});

export default router;
