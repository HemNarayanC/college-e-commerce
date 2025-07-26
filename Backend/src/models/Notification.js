import mongoose, { Types } from "mongoose";

const NotificationSchema = new mongoose.Schema({
  userId: { type: Types.ObjectId, ref: "User" }, // For customers
  vendorId: { type: Types.ObjectId, ref: "Vendor" }, // For vendors
  admin: { type: Boolean, default: false }, // For admin users

  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String }, // Optional: to order, product, ticket, etc.

  isRead: { type: Boolean, default: false },

  type: {
    type: String,
    enum: [
      "order_placed",
      "order_delivered",
      "review",
      "ticket",
      "general",
      "vendor_payout_released",
    ],
    default: "general",
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", NotificationSchema);
