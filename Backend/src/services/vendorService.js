import Vendor from "../models/Vendor.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createToken } from "../utils/authToken.js";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import VendorFeedback from "../models/VendorFeedback.js";

const registerVendor = async (userId, vendorData) => {
  // Check if user exists
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found.");

  // Check if vendor already exists for this user
  const existingVendor = await Vendor.findOne({ userId });
  if (existingVendor) throw new Error("You are already registered as a vendor.");

  // Check if email is already used by another vendor
  const emailExists = await Vendor.findOne({ email: vendorData.email });
  if (emailExists) throw new Error("Email is already associated with another vendor.");

  // Check for duplicate documents
  const duplicateFields = await Vendor.findOne({
    $or: [
      { governmentId: vendorData.governmentId },
      { businessLicense: vendorData.businessLicense },
      { taxRegistration: vendorData.taxRegistration },
    ],
  });
  if (duplicateFields) throw new Error("Duplicate business documents found.");

  // Create new vendor
  const vendor = new Vendor({
    userId,
    businessName: vendorData.businessName,
    businessDescription: vendorData.businessDescription,
    storeLogo: vendorData.storeLogo,
    storeBanner: vendorData.storeBanner,
    email: vendorData.email,
    governmentId: vendorData.governmentId,
    businessLicense: vendorData.businessLicense,
    taxRegistration: vendorData.taxRegistration,
    address: vendorData.address,
    comfortTheme: vendorData.comfortTheme,
  });

  await vendor.save();

  // Optional: update user's role
  user.role = "vendor";
  await user.save();

  return vendor;
};

const loginVendor = async ({ email, password }, res) => {
  const vendor = await Vendor.findOne({ email });
  console.log("Vendor login", vendor)
  if (!vendor) throw new Error("Vendor not found with this email.");

  const user = await User.findById(vendor.userId);
  if (!user) throw new Error("Linked user not found.");

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new Error("Invalid password.");

  if (vendor.status !== "approved") {
    throw new Error("Vendor registration is still pending approval.");
  }

  const token = createToken({ id: user._id, role: "vendor", vendorId: vendor._id });
    res.cookie("userToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
  console.log(token)

  return {
    token: `Bearer ${token}`,
    user: {
      id: user._id,
      name: user.name,
      email: user.email, // original user email
      role: "vendor",
    },
    vendor: {
      id: vendor._id,
      email: vendor.email, // vendor email
      businessName: vendor.businessName,
      status: vendor.status,
    },
  };
};

const getVendorById = async (vendorId) => {
  if (!mongoose.Types.ObjectId.isValid(vendorId)) {
    throw new Error("Invalid vendor ID");
  }

  const vendor = await Vendor.findById(vendorId).lean();

  if (!vendor) return null;

  // Aggregate related stats (e.g. product count, avg rating)
  const [productCount, feedbackStats] = await Promise.all([
    Product.countDocuments({ vendorId }),
    VendorFeedback.aggregate([
      { $match: { vendorId: new mongoose.Types.ObjectId(vendorId) } },
      {
        $group: {
          _id: "$vendorId",
          avgRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]),
  ]);

  const stats = feedbackStats[0] || { avgRating: 0, reviewCount: 0 };

  return {
    ...vendor,
    stats: {
      productCount,
      averageRating: parseFloat(stats.avgRating?.toFixed(1)) || 0,
      reviewCount: stats.reviewCount,
    },
  };
};

export default {
  registerVendor,
  loginVendor,
  getVendorById
};
