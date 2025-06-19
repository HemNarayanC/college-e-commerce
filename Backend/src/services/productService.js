import mongoose from "mongoose";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

const addProduct = async (vendorId, productData) => {
  const {
    name,
    slug,
    categoryId,
    description,
    price,
    stock,
    comfortTags,
    images,
    variants,
    commissionRate,
  } = productData;

  // Check if category exists
  const categoryExists = await Category.findById(categoryId);
  if (!categoryExists) throw new Error("Category not found");

  // Create product
  const product = new Product({
    vendorId,
    name,
    slug,
    categoryId,
    description,
    price,
    stock,
    comfortTags,
    images,
    variants,
    commissionRate,
  });

  return await product.save();
};

const listProducts = async ({ page = 1, limit = 20, filters = {} }) => {
  const skip = (page - 1) * limit;
  const query = { status: "active", ...filters };

  // Count total documents
  const total = await Product.countDocuments(query);

  // Fetch paginated products
  const products = await Product.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 }); // optional: sort newest first

  return {
    totalItems: total,
    page,
    totalPages: Math.ceil(total / limit),
    pageSize: limit,
    products,
  };
};

const getProductById = async (productId) => {
  const product = await Product.findById(productId)
    .populate("vendorId", "businessName")
    .populate("categoryId", "name");

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

const toggleProductStatus = async (vendorId, productId, status) => {
  if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(vendorId)) {
    throw new Error("Invalid ID format");
  }

  const product = await Product.findOneAndUpdate(
    { _id: productId, vendorId },
    { status },
    { new: true }
  );

  console.log("Updated product:", product);

  if (!product) throw new Error("Product not found or unauthorized");

  return product;
};

const searchProducts = async (queryString, { page = 1, limit = 20 }) => {
  const regex = new RegExp(queryString, "i");
  const skip = (page - 1) * limit;

  const query = {
    status: "active",
    $or: [{ name: regex }, { description: regex }, { comfortTags: regex }, { slug: regex }],
  };

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .skip(skip)
    .limit(limit)
    .populate("vendorId", "businessName")
    .populate("categoryId", "name");

  return { total, page, limit, products };
};

export default {
  addProduct,
  listProducts,
  getProductById,
  toggleProductStatus,
  searchProducts
};
