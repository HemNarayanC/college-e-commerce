import express from "express";
import { addCategory } from "../controllers/categroyController.js";
import authenticateVendor from "../middlewares/vendorMiddleware.js";
import {
  addProduct,
  getProductById,
  listProductsHandler,
  searchProductsController,
  toggleProductStatus,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/search", searchProductsController);
router.post("/addCategory", authenticateVendor, addCategory);
router.get("/", listProductsHandler);
router.get("/:id", getProductById);
router.post("/addProduct", authenticateVendor, addProduct);
router.patch("/:id/status", authenticateVendor, toggleProductStatus);

export default router;
