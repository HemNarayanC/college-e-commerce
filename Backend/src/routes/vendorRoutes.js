import express from "express";
import { registerVendor, loginVendor } from "../controllers/vendorController.js";
import auth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", auth, registerVendor); // logged-in user becomes vendor
router.post("/login", loginVendor); // login for vendor

export default router;