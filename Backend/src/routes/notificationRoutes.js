// routes/notificationRoutes.js
import express from "express";
import {
  getUserNotifications,
  getVendorNotifications,
  markNotificationAsRead,
} from "../controllers/notificationController.js";
import authenticateUserOrVendor from "../middlewares/sharedFlagMiddleware.js";

const router = express.Router();

router.get("/customer", authenticateUserOrVendor, getUserNotifications);
router.get("/vendor", authenticateUserOrVendor, getVendorNotifications);
router.patch("/:id/read", authenticateUserOrVendor, markNotificationAsRead);

export default router;
