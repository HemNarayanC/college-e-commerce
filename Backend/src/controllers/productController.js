// controllers/productController.js
import productService from "../services/productService.js";

// Add a new product
const addProduct = async (req, res) => {
  try {
    const vendorId = req.user.vendorId; // comes from token
    const productData = req.body;
    // console.log("Adding product for vendor:", vendorId, "with data:", productData);

    if (typeof productData.comfortTags === 'string') {
      productData.comfortTags = JSON.parse(productData.comfortTags);
    }

    if (typeof productData.variants === 'string') {
      productData.variants = JSON.parse(productData.variants);
    }

    // Extract Cloudinary image URLs and add to productData
    productData.images = req.files?.map(file => file.path) || [];

    const savedProduct = await productService.addProduct(vendorId, productData);

    res.status(201).json({
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//List all products with pagination and filters
const listProductsHandler = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, tag } = req.query;
    const filters = {};
    if (category) filters.categoryId = category;
    if (tag) filters.comfortTags = tag;

    const result = await productService.listProducts({
      page: parseInt(page),
      limit: parseInt(limit),
      filters,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    const product = await productService.toggleProductStatus(vendorId, productId, productStatus);
    res.status(200).json({ message: "Status updated", product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const searchProductsController = async (req, res) => {
  try {
    const queryString = req.query.q || ""; // search keywords from query param `q`
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await productService.searchProducts(queryString, { page, limit });

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
  try {
    await productService.deleteProduct(req.user.vendorId, req.params.id);
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.user.vendorId, req.params.id, req.body);
    res.status(200).json({ message: "Product updated", product });
  } catch (err) {
    res.status(400).json({ error: err.message });
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

export { addProduct, listProductsHandler, getProductById, toggleProductStatus , searchProductsController, deleteProduct, updateProduct, listVendorProducts };
