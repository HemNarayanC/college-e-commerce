
import express from "express";
import auth from "../../middlewares/authMiddleware.js";
import { getDashboard } from "../../controllers/dashboard/customerDashboardController.js";

const router = express.Router();

router.get("/", auth, getDashboard);

export default router;
