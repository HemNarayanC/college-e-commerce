import express from "express";
import { addCategory } from "../controllers/categroyController.js";
import authenticateVendor from "../middlewares/vendorMiddleware.js";
import {
  addProduct,
  deleteProduct,
  getProductById,
  listProductsHandler,
  listVendorProducts,
  searchProductsController,
  toggleProductStatus,
  updateProduct,
} from "../controllers/productController.js";
import { uploadProductImage } from "../services/cloudinaryConfig.js";

const router = express.Router();

router.get("/search", searchProductsController);
router.post("/addCategory", authenticateVendor, addCategory);
router.get("/", listProductsHandler);
router.get("/vendor", authenticateVendor, listVendorProducts);
router.get("/:id", getProductById);
router.post(
  "/addProduct",
  uploadProductImage.array("images", 5),
  authenticateVendor,
  addProduct
);
router.patch("/:id/status", authenticateVendor, toggleProductStatus);
router.put("/:id", authenticateVendor, updateProduct);
router.delete("/:id", authenticateVendor, deleteProduct);

export default router;
