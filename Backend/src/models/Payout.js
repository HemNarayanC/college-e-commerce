import mongoose, { Types } from "mongoose";

const VendorPayout = new mongoose.Schema({
  vendorId: { type: Types.ObjectId, ref: "Vendor", required: true },
  amount: { type: Number, required: true, min: 0 },
  payoutDate: { type: Date },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  referenceId: { type: String, unique: true, sparse: true }
});

export default mongoose.model("VendorPayout", VendorPayout);