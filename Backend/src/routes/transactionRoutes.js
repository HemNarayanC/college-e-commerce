import express from "express";
import { saveCODTransaction } from "../controllers/transactionController.js";
import auth from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/cod", auth, saveCODTransaction);

export default router;
