import express from "express";
import authenticateAdmin from "../../middlewares/authAdminMiddleware.js";
import getAdminDashboardData from "../../controllers/dashboard/adminDashboardController.js";

const router = express.Router();

router.get("/", authenticateAdmin, getAdminDashboardData);

export default router;