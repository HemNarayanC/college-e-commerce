// controllers/productController.js
import productService from "../services/productService.js";

// Add a new product
const addProduct = async (req, res) => {
  try {
    const vendorId = req.user.vendorId; // comes from token
    const productData = req.body;
    // console.log("Adding product for vendor:", vendorId, "with data:", productData);

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

export { addProduct, listProductsHandler, getProductById };
