import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    image: { type: String, default: "" }, 
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("MenuItem", menuItemSchema);
