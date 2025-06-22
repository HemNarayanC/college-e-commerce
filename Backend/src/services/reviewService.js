import mongoose, { set } from "mongoose";
import Product from "../models/Product.js";
import Review from "../models/Review.js";
import Vendor from "../models/Vendor.js";
import User from "../models/User.js";

const addReview = async (userId, { productId, rating, comment, comfortScore }) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  const existing = await Review.findOne({ userId, productId });
  if (existing) {
    throw new Error("You have already reviewed this product");
  }

  // Ensure product exists and is active
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  const review = new Review({
    userId,
    productId,
    rating,
    comment,
    comfortScore,
  });
  await review.save();
  return review;
};

const getReviewsByProduct = async (productId, { page = 1, limit = 10 }) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }
  const filter = { productId, isActive: true };
  const skip = (page - 1) * limit;
  const [total, reviews] = await Promise.all([
    Review.countDocuments(filter),
    Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name")      // show reviewer name
      .populate({
        path: "replies.userId",
        select: "name role",           // who replied
      })
  ]);
  return {
    total,
    page,
    limit,
    reviews,
  };
};

const replyToReview = async (vendorId, reviewId, message) => {
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new Error("Invalid review ID");
  }
  const review = await Review.findById(reviewId);
  if (!review || !review.isActive) {
    throw new Error("Review not found");
  }
  // Ensure this vendor actually owns the product being reviewed
  const productId = review.productId;
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");
  if (product.vendorId.toString() !== vendorId.toString()) {
    throw new Error("Not authorized to reply to this review");
  }
  // Append reply
  review.replies.push({
    userId: vendorId,
    message: message.trim(),
    createdAt: new Date(),
  });
  await review.save();
  return review;
};

const flagReview = async (userId, reviewId, reason) => {
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new Error("Invalid review ID");
  }
  const review = await Review.findById(reviewId);
  if (!review) throw new Error("Review not found");
  // Prevent same user flagging multiple times
  const already = review.flags.some(f => f.userId.toString() === userId.toString());
  if (already) {
    throw new Error("You have already flagged this review");
  }
  review.flags.push({
    userId,
    reason: reason?.trim(),
    createdAt: new Date(),
  });
  await review.save();
  return review;
};

const getFlaggedReviews = async ({ page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  const filter = { "flags.0": { $exists: true } };

  const total = await Review.countDocuments(filter);

  const reviews = await Review.find(filter)
    .sort({ "flags.length": -1, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("flags productId createdAt") // only what we need
    .lean();

  const formattedReviews = reviews.map(review => ({
    reviewId: review._id,
    productId: review.productId,
    flaggedAt: review.createdAt,
    flags: review.flags.map(flag => ({
      flaggerId: flag.userId,
      reason: flag.reason,
      flaggedAt: flag.createdAt,
    })),
  }));

  return { total, page, limit, flaggedReviews: formattedReviews };
};

const setReviewActive = async (reviewId, isActive) => {
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new Error("Invalid review ID");
  }
  const review = await Review.findById(reviewId);
  if (!review) throw new Error("Review not found");
  review.isActive = isActive;
  await review.save();
  return review;
};


export default {
  addReview,
  getReviewsByProduct,
  replyToReview,
  flagReview,
  getFlaggedReviews,
  setReviewActive,
};