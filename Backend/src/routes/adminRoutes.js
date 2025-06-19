import express from "express";
import authenticateAdmin from "../middlewares/authAdminMiddleware.js";
import { approveVendor } from "../controllers/adminVendorController.js";

const router = express.Router();

// Approve vendor (Admin only)
router.put("/vendors/:vendorId/approve", authenticateAdmin, approveVendor);

export default router;