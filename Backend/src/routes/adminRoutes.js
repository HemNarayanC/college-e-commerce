import express from "express";
import authenticateAdmin from "../middlewares/authAdminMiddleware.js";
import { approveVendor, confirmDelivery } from "../controllers/adminVendorController.js";
import {
  getFlaggedReviews,
  setReviewActive,
} from "../controllers/reviewController.js";
import { toggleCustomerStatus } from "../controllers/userController.js";


const router = express.Router();

// Approve vendor (Admin only)
router.put("/vendors/:vendorId/status", authenticateAdmin, approveVendor);
router.get("/flagged", authenticateAdmin, getFlaggedReviews);
router.patch("/:reviewId/active", authenticateAdmin, setReviewActive);
router.post("/confirmdelivery", authenticateAdmin, confirmDelivery);
router.patch("/customers/:customerId/status", authenticateAdmin, toggleCustomerStatus);

export default router;