import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import "dotenv/config.js";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./db.js";
import { attachUser } from "./utils/auth.js";

// routes
import authRouter from "./routes/auth.js";
import categoriesRouter from "./routes/categories.js";
import menuItemsRouter from "./routes/menuitems.js";
import reservationsRouter from "./routes/reservations.js";
import tablesRouter from "./routes/tables.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const DEV_ORIGINS = [
  "http://127.0.0.1:5173",
  "http://localhost:5173",
  "http://127.0.0.1:5174",
  "http://localhost:5174",
];

app.use(
  cors({
    origin(origin, cb) {
      const allow =
        !origin ||
        DEV_ORIGINS.includes(origin) ||
        origin === process.env.CLIENT_ORIGIN;
      cb(null, allow);
    },
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(attachUser);


app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Health check
app.get("/api", (_req, res) => res.json({ ok: true, app: "DineSphere API" }));

// Mount routes
app.use("/api/auth", authRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/menuitems", menuItemsRouter);
app.use("/api/reservations", reservationsRouter);
app.use("/api/tables", tablesRouter);

app.use((err, req, res, _next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`API on http://0.0.0.0:${PORT}`));
const PORT = Number(process.env.PORT || 5000);
(async () => {
  await connectDB(process.env.MONGODB_URI);
  app.listen(PORT, "0.0.0.0", () =>
    console.log(`API on http://127.0.0.1:${PORT}`)
  );
})();
