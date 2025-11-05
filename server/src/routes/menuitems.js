import { Router } from "express";
import MenuItem from "../models/MenuItem.js";
import Category from "../models/Category.js";

const router = Router();

// GET /api/menuitems
router.get("/", async (req, res) => {
  try {
    const { featured, category } = req.query;

    const filter = {};
    if (featured === "true") filter.featured = true;

    if (category) {
      // accept slug OR ObjectId
      let catId = category;
      if (!/^[0-9a-fA-F]{24}$/.test(category)) {
        const cat = await Category.findOne({ slug: category });
        if (!cat) return res.status(200).json([]); // unknown category -> empty list
        catId = String(cat._id);
      }
      filter.category = catId;
    }

    const items = await MenuItem.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    console.error("Error fetching menu items:", err);
    res.status(500).json({ message: "Failed to fetch menu items" });
  }
});

// GET /api/menuitems/:id
router.get("/:id", async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate("category", "name slug");
    if (!item) return res.status(404).json({ message: "Not Found" });
    res.json(item);
  } catch (err) {
    res.status(404).json({ message: "Not Found" });
  }
});

export default router;
