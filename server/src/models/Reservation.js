import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, required: true },
    guests: { type: String, default: "2-4" },
    date: { type: String, required: true },
    time: { type: String, required: true },
    tableCode: { type: String, default: "" },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);
