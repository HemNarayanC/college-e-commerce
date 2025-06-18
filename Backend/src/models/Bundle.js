import mongoose from "mongoose";

const BundleSchema = new mongoose.Schema({
  vendorId: { type: Types.ObjectId, ref: "Vendor", required: true },
  name: { type: String, required: true },
  description: { type: String },
  theme: { type: String },
  thumbnail: { type: String },
  products: [{
    productId: { type: Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 }
  }],
  totalPrice: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
  comfortScore: { type: Number, min: 0, max: 10 }
});

export default mongoose.model("Bundle", BundleSchema);