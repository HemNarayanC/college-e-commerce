import express from "express";
import { registerVendor, loginVendor, getFeaturedVendors, getVendorById, getAllVendors } from "../controllers/vendorController.js";
import auth from "../middlewares/authMiddleware.js";
import { uploadVendorProfile } from "../services/cloudinaryConfig.js";
import authenticateVendor from "../middlewares/vendorMiddleware.js";
import { replyToReview } from "../controllers/reviewController.js";
import { getVendorFeedbacks, getVendorRating } from "../controllers/vendorFeedbackController.js";

const router = express.Router();

router.get("/", getAllVendors)
router.post("/register",  uploadVendorProfile.fields([
  { name: "storeLogo", maxCount: 1 },
  { name: "storeBanner", maxCount: 1 }
]), auth, registerVendor); // logged-in user becomes vendor
router.post("/login", loginVendor); // login for vendor
router.get("/featured", getFeaturedVendors);
router.get("/:vendorId", getVendorById)
router.post("/:reviewId/reply", authenticateVendor, replyToReview);
router.get("/:vendorId/feedbacks", getVendorFeedbacks); 
router.get("/:vendorId/rating", getVendorRating);

export default router;