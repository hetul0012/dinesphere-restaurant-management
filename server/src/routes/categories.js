import { Router } from "express";
import Category from "../models/Category.js";

const router = Router();

// GET /api/categories
router.get("/", async (_req, res) => {
  const cats = await Category.find({}).sort("name");
  res.json(cats);
});

export default router;
