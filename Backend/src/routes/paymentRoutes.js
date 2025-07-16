import express from "express";
import { initiatePayment, verifyPayment } from "../controllers/khaltiController.js";
import auth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/initiate", auth, initiatePayment);
router.get("/verify", auth, verifyPayment);

export default router;
