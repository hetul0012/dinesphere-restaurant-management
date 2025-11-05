import "dotenv/config.js";
import mongoose from "mongoose";
import { connectDB } from "../db.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import MenuItem from "../models/MenuItem.js";
import Reservation from "../models/Reservation.js";
import Table from '../models/Table.js';

async function run() {
  await connectDB(process.env.MONGODB_URI);

  await Category.deleteMany({});
  await MenuItem.deleteMany({});

  await Reservation.deleteMany({ name: "Hetul Suthar" });

  // categories
  const catData = [
    { name: "Starters", slug: "starters" },
    { name: "Mains", slug: "mains" },
    { name: "Desserts", slug: "desserts" },
    { name: "Drinks", slug: "drinks" }
  ];
  const cats = await Category.insertMany(catData);
  const bySlug = (s) => cats.find(c => c.slug === s)._id;

  //tables
  const ensureTables = async () => {
    const count = await Table.countDocuments();
    if (count === 0) {
      await Table.insertMany([
        { number: 1, seats: 2, label: 'T-1', available: true },
        { number: 2, seats: 2, label: 'T-2', available: true },
        { number: 3, seats: 4, label: 'T-3', available: false },
        { number: 4, seats: 4, label: 'T-4', available: true },
        { number: 5, seats: 6, label: 'T-5', available: true },
      ]);
      console.log('Seeded tables ✔');
    }
  };
  
  await ensureTables();

  // menu items 
  const items = [
    { name: "Paneer Tikka", description: "Marinated paneer grilled with spices", price: 18, image: "paneer.png", category: bySlug("starters"), featured: true },
    { name: "Pasta Alfredo", description: "Creamy alfredo with parmesan", price: 20, image: "pasta.png", category: bySlug("mains"), featured: true },
    { name: "Grilled Chicken Herb", description: "Chicken with herbs & veggies", price: 24, image: "chicken.png", category: bySlug("mains"), featured: true },
    { name: "Beef Tenderloin", description: "Perfectly seared tenderloin steak", price: 38, image: "tenderloin.png", category: bySlug("mains") },
    { name: "Risotto", description: "Creamy mushroom risotto", price: 22, image: "risotto.png", category: bySlug("mains") },
    { name: "Chocolate Lava Cake", description: "Warm center chocolate dessert", price: 12, image: "lava_cake.png", category: bySlug("desserts"), featured: true },
    { name: "Lemonade", description: "Freshly squeezed lemon drink", price: 6, image: "lemonade.png", category: bySlug("drinks") },
    { name: "Grilled Salmon", description: "Atlantic salmon with citrus butter", price: 28, image: "salmon.png", category: bySlug("mains") }
  ];
  await MenuItem.insertMany(items);

  // admin 
  let admin = await User.findOne({ email: "admin@dinesphere.com" });
  if (!admin) {
    admin = new User({ name: "Admin", email: "admin@dinesphere.com", role: "admin" });
    await admin.setPassword("Admin@123"); 
    await admin.save();
  }
  // sample customer
  let hetul = await User.findOne({ email: "hetul@example.com" });
  if (!hetul) {
    hetul = new User({ name: "Hetul Suthar", email: "hetul@example.com", role: "customer" });
    await hetul.setPassword("Pass@123");
    await hetul.save();
  }

  // sample reservation for Hetul
  await Reservation.create({
    user: hetul._id,
    name: "Hetul Suthar",
    email: "hetul@example.com",
    phone: "+1 (555) 123-4567",
    guests: "2-4",
    date: "2025-12-28",
    time: "19:30",
    tableCode: "T-12",
    status: "confirmed",
    notes: "Window seat if possible."
  });

  console.log("Seed complete npm run seed");
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
