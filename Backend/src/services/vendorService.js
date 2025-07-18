import Vendor from "../models/Vendor.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createToken } from "../utils/authToken.js";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import VendorFeedback from "../models/VendorFeedback.js";

const registerVendor = async (userId, data) => {
  const {
    businessName,
    businessDescription,
    storeLogo,
    storeBanner,
    email,
    governmentId,
    businessLicense,
    taxRegistration,
    address,
    comfortTheme,
    isPlatformSeller = false,
  } = data;

  // Check for existing vendor with same email
  const existingVendor = await Vendor.findOne({ email });
  if (existingVendor) {
    throw new Error("Vendor with this email already exists");
  }

  // Check user's role from DB
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  console.log("Registering vendor for user:", userId, "with roles:", user.role);

  // Only allow isPlatformSeller true if the user is an admin
  const isAdmin = user.role.includes("admin");
  const finalPlatformSellerStatus = !isAdmin ? isPlatformSeller : true;
  console.log("Final platform seller status:", finalPlatformSellerStatus);
  if (isPlatformSeller && !isAdmin) {
    throw new Error("Only admins can register as platform sellers");
  }
  const vendorStatus = isAdmin ? "approved" : "pending";

  // Create vendor
  const vendor = new Vendor({
    userId,
    businessName,
    businessDescription,
    storeLogo,
    storeBanner,
    email,
    governmentId,
    businessLicense,
    taxRegistration,
    address,
    comfortTheme,
    isPlatformSeller: finalPlatformSellerStatus,
    status: vendorStatus,
  });

  await vendor.save();

  // Ensure "vendor" role is added to user
  if (!user.role.includes("vendor")) {
    user.role.push("vendor");
    await user.save();
  }

  return vendor;
};

const loginVendor = async ({ email, password }, res) => {
  const vendor = await Vendor.findOne({ email });
  console.log("Vendor login", vendor);
  if (!vendor) throw new Error("Vendor not found with this email.");

  const user = await User.findById(vendor.userId);
  if (!user) throw new Error("Linked user not found.");

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new Error("Invalid password.");

  if (vendor.status !== "approved") {
    throw new Error("Vendor registration is still pending approval.");
  }

  const token = createToken({
    id: user._id,
    role: user.role,
    vendorId: vendor._id,
  });
  res.cookie("userToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
  console.log(token);

  return {
    token: `Bearer ${token}`,
    user: {
      id: user._id,
      name: user.name,
      email: user.email, // original user email
      role: user.role, // user roles
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
  getVendorById,
};
