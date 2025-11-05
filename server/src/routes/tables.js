import { Router } from "express";
import Table from "../models/Table.js";
import Reservation from "../models/Reservation.js";
import { requireAdmin } from "../utils/auth.js";

const router = Router();

// GET /api/tables
router.get("/", async (_req, res) => {
  const tables = await Table.find().sort({ name: 1 }).lean();
  res.json(tables);
});

// GET /api/tables/availability
router.get("/availability", async (req, res) => {
  const { date, time } = req.query; // date
  if (!date || !time) {
    return res.status(400).json({ message: "date and time are required" });
  }
  const day = new Date(`${date}T00:00:00`);
  const next = new Date(day);
  next.setDate(day.getDate() + 1);

  const reservations = await Reservation.find({
    date: { $gte: day, $lt: next },
    time, // stored as "HH:mm"
  }).lean();

  const taken = new Set(reservations.map((r) => String(r.tableId)));
  const tables = await Table.find().sort({ name: 1 }).lean();
  const result = tables.map((t) => ({
    ...t,
    isReserved: taken.has(String(t._id)),
  }));
  res.json(result);
});

// Admin 
router.put("/:id", requireAdmin, async (req, res) => {
  const doc = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(doc);
});

export default router;
