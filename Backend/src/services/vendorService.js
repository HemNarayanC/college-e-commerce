import Vendor from "../models/Vendor.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createToken } from "../utils/authToken.js";

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
  if (!vendor) throw new Error("Vendor not found with this email.");

  const user = await User.findById(vendor.userId);
  if (!user) throw new Error("Linked user not found.");

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new Error("Invalid password.");

  if (vendor.status !== "approved") {
    throw new Error("Vendor registration is still pending approval.");
  }

  const token = createToken({ id: user._id, role: "vendor", vendorId: vendor._id });
    res.cookie("vendorToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

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


export default {
  registerVendor,
  loginVendor,
};
