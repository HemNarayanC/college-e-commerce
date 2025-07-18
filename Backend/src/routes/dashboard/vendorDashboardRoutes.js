import express from "express";
import authenticateVendor from "../../middlewares/vendorMiddleware.js";
import { getVendorDashboard } from "../../controllers/dashboard/vendorDashboardController.js";

const router = express.Router();

router.get("/", authenticateVendor, getVendorDashboard);

export default router;
