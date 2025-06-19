import Vendor from "../models/Vendor.js";
import User from "../models/User.js";

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

export default {
  registerVendor
};
