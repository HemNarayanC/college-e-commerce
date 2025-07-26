import mongoose, { Types } from "mongoose";
import { EMAIL_REGEX } from "../constants/regex.js";

const VendorSchema = new mongoose.Schema({
  userId: { type: Types.ObjectId, ref: "User", unique: true, required: true },
  businessName: { type: String, required: true, trim: true },
  businessDescription: { type: String, trim: true },
  storeLogo: { type: String, required: true },
  storeBanner: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (email) {
        return EMAIL_REGEX.test(email);
      },
      message: "Invalid email address",
    },
  },
  governmentId: { type: String, required: true, unique: true, trim: true },
  businessLicense: { type: String, required: true, unique: true },
  taxRegistration: { type: String, required: true, unique: true },
  address: {
    city: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: String, required: true, match: /^[0-9]{5,6}$/ },
  },
  comfortTheme: { type: String },
  ratingAvg: { type: Number, default: 0, min: 0, max: 5 },
  status: {
    type: String,
    enum: ["approved", "pending", "suspended", "rejected"],
    default: "pending",
  },
  commissionRate: { type: Number, default: 0.1, min: 0, max: 1 },
  isFeatured: { type: Boolean, default: true },
  isPlatformSeller: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Vendor", VendorSchema);
