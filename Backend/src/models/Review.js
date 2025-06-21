import mongoose, { Types } from "mongoose";

const ReviewReplySchema = new mongoose.Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true }, // vendor or admin
  message: { type: String, required: true, trim: true, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

const ReviewFlagSchema = new mongoose.Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true }, // who flagged
  reason: { type: String, trim: true, maxlength: 300 },
  createdAt: { type: Date, default: Date.now },
});

const ReviewSchema = new mongoose.Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true },
  productId: { type: Types.ObjectId, ref: "Product", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true, maxlength: 1000 },
  comfortScore: { type: Number, min: 0, max: 10 },
  createdAt: { type: Date, default: Date.now },

  replies: [ReviewReplySchema],   // vendor/admin replies
  flags: [ReviewFlagSchema],      // flags by users/vendors

  isActive: { type: Boolean, default: true }, // soft-delete or deactivated by admin
});

// Optional index: to fetch reviews by product quickly
ReviewSchema.index({ productId: 1, createdAt: -1 });

export default mongoose.model("Review", ReviewSchema);
