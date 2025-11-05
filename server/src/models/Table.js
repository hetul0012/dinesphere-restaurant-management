import mongoose from 'mongoose';

const TableSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true, unique: true },
    label: { type: String, default: '' },
    seats: { type: Number, required: true, min: 1 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Table', TableSchema);
