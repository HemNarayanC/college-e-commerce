import express from "express";
import auth from "../middlewares/authMiddleware.js";
import authenticateVendor from "../middlewares/vendorMiddleware.js";
import { createOrder, getVendorOrders, updateOrderItemStatus } from "../controllers/orderController.js";

const router = express.Router();

router.post("/place-order", auth, createOrder);
router.get("/vendor/orders", authenticateVendor, getVendorOrders);
router.patch("/vendor/item/status", authenticateVendor, updateOrderItemStatus);

export default router;
