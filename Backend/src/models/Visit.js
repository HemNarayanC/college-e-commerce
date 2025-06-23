
import mongoose, { Types } from "mongoose";

const visitSchema = new mongoose.Schema({
  vendorId: { type: Types.ObjectId, ref: "Vendor", required: true },
  productId: { type: Types.ObjectId, ref: "Product" },
  userIp: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Visit", visitSchema);
