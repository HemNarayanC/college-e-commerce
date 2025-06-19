import mongoose, { Types } from "mongoose";

const ProductSchema = new mongoose.Schema({
  vendorId: { type: Types.ObjectId, ref: "Vendor", required: true },
  categoryId: { type: Types.ObjectId, ref: "Category", required: true },
  name: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  comfortTags: [{ type: String }],
  images: [{ type: String }],
  variants: [{
    color: { type: String },
    price: { type: Number, min: 0 },
    stock: { type: Number, min: 0 }
  }],
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  commissionRate: { type: Number, min: 0, max: 1 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Product", ProductSchema);