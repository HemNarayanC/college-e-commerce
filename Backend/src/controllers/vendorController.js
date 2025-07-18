import vendorService from "../services/vendorService.js";
import Vendor from "../models/Vendor.js";
import mongoose from "mongoose";

// Register Vendor
const registerVendor = async (req, res) => {
  try {
    const userId = req.user.userId;

    let vendorData = req.body;

    // Parse address if sent as stringified JSON
    if (typeof vendorData.address === "string") {
      try {
        vendorData.address = JSON.parse(vendorData.address);
      } catch (err) {
        return res.status(400).json({ error: "Invalid address JSON format" });
      }
    }

    // Attach uploaded file paths if they exist
    vendorData.storeLogo = req.files?.storeLogo?.[0]?.path || "";
    vendorData.storeBanner = req.files?.storeBanner?.[0]?.path || "";

    const vendor = await vendorService.registerVendor(userId, vendorData);

    res.status(201).json({
      message: "Vendor registered successfully",
      vendor,
    });
  } catch (error) {
    console.error("Vendor registration failed:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};


// Login Vendor
const loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user, vendor } = await vendorService.loginVendor(
      { email, password },
      res
    );

    res.status(200).json({
      message: "Vendor logged in successfully",
      token,
      user,
      vendor,
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Get All Vendors
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().select("-__v");
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Featured Vendors
const getFeaturedVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({ isFeatured: true }).select("-__v");
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVendorById = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const vendor = await vendorService.getVendorById(vendorId);

    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  registerVendor,
  loginVendor,
  getAllVendors,
  getFeaturedVendors,
  getVendorById,
};
