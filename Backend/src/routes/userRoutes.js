import express from "express";
import auth from "../middlewares/authMiddleware.js";

import {
  getAllUsers,
  getProfile,
  updateProfile,
  changePassword,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearCart,
  removeFromCart,
  updateCart,
  addToCart,
  getCart,
  getUserOrderHistory,
  getUserById,
} from "../controllers/userController.js";
import { submitFeedback } from "../controllers/vendorFeedbackController.js";
import { addReview } from "../controllers/reviewController.js";

const router = express.Router();

// User Account
router.get("/", getAllUsers);
router.get("/profile", auth, getProfile);
router.get("/profile/:userId", auth, getUserById)
router.put("/profile", auth, updateProfile);
router.put("/change-password", auth, changePassword);

// Review & Feedback
router.post("/add-review", auth, addReview);
router.post("/vendor-feedback", auth, submitFeedback);

// Wishlist
router.get("/wishlist", auth, getWishlist);
router.post("/wishlist", auth, addToWishlist);
router.delete("/wishlist/:productId", auth, removeFromWishlist);

//Cart
router.get("/cart", auth, getCart);
router.post("/cart", auth, addToCart);
router.put("/cart", auth, updateCart);
router.delete("/cart/:productId", auth, removeFromCart);
router.delete("/cart", auth, clearCart);

//order history
router.get("/orders/history", auth, getUserOrderHistory);

export default router;
