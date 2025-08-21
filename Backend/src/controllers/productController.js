import mongoose from "mongoose";
import productService from "../services/productService.js";

// Add a new product
const addProduct = async (req, res) => {
  try {
    const vendorId = req.user.vendorId; // Extracted from token
    const productData = req.body;

    // Parse comfortTags if it's sent as a string
    if (typeof productData.comfortTags === "string") {
      productData.comfortTags = JSON.parse(productData.comfortTags);
    }

    // Parse variants if it's sent as a string
    if (typeof productData.variants === "string") {
      productData.variants = JSON.parse(productData.variants);
    }

    // Ensure numeric stock and price
    if (productData.stock) {
      productData.stock = Number(productData.stock);
    }

    if (Array.isArray(productData.variants)) {
      productData.variants = productData.variants.map((v) => ({
        ...v,
        stock: Number(v.stock || 0),
        price: Number(v.price || 0),
      }));
    }

    // Extract Cloudinary image URLs from uploaded files
    productData.images = req.files?.map((file) => file.path) || [];

    const savedProduct = await productService.addProduct(vendorId, productData);

    res.status(201).json({
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const listProductsHandler = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      vendor,
      tag,
      stock,
      minPrice,
      maxPrice,
      sortBy,
    } = req.query;

    const filters = {};

    // Filter: category
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filters.categoryId = new mongoose.Types.ObjectId(category);
    }

    // Filter: vendor
    if (vendor && mongoose.Types.ObjectId.isValid(vendor)) {
      filters.vendorId = new mongoose.Types.ObjectId(vendor);
    }

    // Filter: tag (assume comfortTags is an array)
    if (tag) {
      if (Array.isArray(tag)) {
        filters.comfortTags = { $in: tag };
      } else {
        filters.comfortTags = { $in: [tag] };
      }
    }

    // Filter: stock
    if (stock === "true") {
      filters.countInStock = { $gt: 0 };
    }

    // Filter: price range
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseFloat(minPrice);
      if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
    }

    // Call your product service to get paginated products with filters and sort
    const result = await productService.listProducts({
      page: parseInt(page),
      limit: parseInt(limit),
      filters,
      sortBy,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in listProductsHandler:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//Fetch single product by ID
const getProductById = async (req, res) => {
  const productId = req.params.id;
  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }
  try {
    const product = await productService.getProductById(productId);
    console.log("Fetched product:", product);
    res.status(200).json(product);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/** Soft-Delete or Toggle product status (active/inactive) */
const toggleProductStatus = async (req, res) => {
  const vendorId = req.user.vendorId;
  const productId = req.params.id; // product ID from URL
  const productStatus = req.body.status; // product status from request body
  try {
    const product = await productService.toggleProductStatus(
      vendorId,
      productId,
      productStatus
    );
    res.status(200).json({ message: "Status updated", product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const searchProductsController = async (req, res) => {
  try {
    const queryString = req.query.q || ""; // search keywords from query param `q`
    console.log("Search query:", queryString);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await productService.searchProducts(queryString, {
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to search products",
    });
  }
};

// Delete a product permanently by vendor only
const deleteProduct = async (req, res) => {
  console.log("Product Deleteing for id", req.params.id)
  
  try {
    await productService.deleteProduct(req.user.vendorId, req.params.id);
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;
    const productId = req.params.id;
    const updates = req.body;

    // Parse JSON fields if needed
    if (typeof updates.comfortTags === "string") {
      updates.comfortTags = JSON.parse(updates.comfortTags);
    }

    if (typeof updates.variants === "string") {
      updates.variants = JSON.parse(updates.variants);
    }

    if (typeof updates.stock === "string") {
      updates.stock = Number(updates.stock);
    }

    if (Array.isArray(updates.variants)) {
      updates.variants = updates.variants.map((v) => ({
        ...v,
        stock: Number(v.stock || 0),
        price: Number(v.price || 0),
      }));
    }

    // Handle images
    if (req.files && req.files.length > 0) {
      // New images uploaded — use them
      updates.images = req.files.map((file) => file.path);
    } else if (updates.images) {
      // Images field is sent in body — handle as explicit update
      if (typeof updates.images === "string") {
        updates.images = JSON.parse(updates.images);
      }
      // This could be an empty array — that's fine (means delete all)
    } else {
      // No change to images — do not modify
      delete updates.images;
    }

    const updatedProduct = await productService.updateProduct(vendorId, productId, updates);

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(400).json({ error: error.message });
  }
};


const listVendorProducts = async (req, res) => {
  try {
    const products = await productService.listVendorProducts(req.user.vendorId);
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const listProductsByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    if (!vendorId) {
      return res.status(400).json({ error: "Vendor ID is required." });
    }

    const products = await productService.getProductsByVendor(vendorId);
    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  addProduct,
  listProductsHandler,
  getProductById,
  toggleProductStatus,
  searchProductsController,
  deleteProduct,
  updateProduct,
  listVendorProducts,
  listProductsByVendor,
};
