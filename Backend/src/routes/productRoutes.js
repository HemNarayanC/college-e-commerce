import express from "express";
import { addCategory, getCategories } from "../controllers/categroyController.js";
import authenticateVendor from "../middlewares/vendorMiddleware.js";
import {
  addProduct,
  deleteProduct,
  getProductById,
  listProductsByVendor,
  listProductsHandler,
  listVendorProducts,
  searchProductsController,
  toggleProductStatus,
  updateProduct,
} from "../controllers/productController.js";
import { uploadProductImage } from "../services/cloudinaryConfig.js";
import { getReviewsByProduct } from "../controllers/reviewController.js";

const router = express.Router();

router.get("/search", searchProductsController);
router.post("/addCategory", authenticateVendor, addCategory);
router.get("/getCategory", getCategories);
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
router.put(
  "/:id",
  uploadProductImage.array("images", 5),
  authenticateVendor,
  updateProduct
);
router.delete("/:id", authenticateVendor, deleteProduct);
router.get("/review/:productId", getReviewsByProduct);
router.get("/vendor/:vendorId/products", listProductsByVendor);

export default router;
