import express from "express";
import authenticateAdmin from "../middlewares/authAdminMiddleware.js";
import { approveVendor, confirmDelivery } from "../controllers/adminVendorController.js";
import {
  getFlaggedReviews,
  setReviewActive,
} from "../controllers/reviewController.js";


const router = express.Router();

// Approve vendor (Admin only)
router.put("/vendors/:vendorId/approve", authenticateAdmin, approveVendor);
router.get("/flagged", authenticateAdmin, getFlaggedReviews);
router.patch("/:reviewId/active", authenticateAdmin, setReviewActive);
router.post("/confirmdelivery", authenticateAdmin, confirmDelivery);

export default router;