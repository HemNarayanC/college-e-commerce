import mongoose from "mongoose";
import VendorFeedback from "../models/VendorFeedback.js";


const addFeedback = async (userId, { vendorId, rating, comment }) => {
  if (!rating || rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  const feedback = new VendorFeedback({
    vendorId,
    userId,
    rating,
    comment,
  });

  return await feedback.save();
};

const getVendorFeedbacks = async (vendorId) => {
  return await VendorFeedback.find({ vendorId })
    .populate("userId", "name")
    .sort({ createdAt: -1 });
};

const getAverageRating = async (vendorId) => {
  const agg = await VendorFeedback.aggregate([
    {
      $match: {
        vendorId: new mongoose.Types.ObjectId(vendorId),
      },
    },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  return agg[0] || { avgRating: 0, count: 0 };
};


export default {
  addFeedback,
  getVendorFeedbacks,
  getAverageRating,
};
