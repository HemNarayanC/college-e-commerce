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
    stock = 0, // base stock
    comfortTags,
    images,
    variants,
    // commissionRate,
  } = productData;

  const categoryExists = await Category.findById(categoryId);
  if (!categoryExists) throw new Error("Category not found");

  // Total variant stock
  const variantStock = Array.isArray(variants)
    ? variants.reduce((sum, v) => sum + Number(v.stock || 0), 0)
    : 0;

  // Total product stock = base + variant
  const totalStock = Number(stock) + variantStock;

  const product = new Product({
    vendorId,
    name,
    slug,
    categoryId,
    description,
    price: Number(price),
    stock: totalStock,
    comfortTags,
    images,
    variants,
    // commissionRate: Number(commissionRate || 0),
  });

  return await product.save();
};

const listProducts = async ({ page = 1, limit = 20, filters = {}, sortBy }) => {
  const skip = (page - 1) * limit;
  const query = { status: "active", ...filters };

  let sort = {};
  if (sortBy) {
    const direction = sortBy.startsWith("-") ? -1 : 1;
    const field = sortBy.replace("-", "");
    sort = { [field]: direction };
  } else {
    sort = { createdAt: -1 };
  }

  const total = await Product.countDocuments(query);

  const products = await Product.find(query).skip(skip).limit(limit).sort(sort);

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
  if (
    !mongoose.Types.ObjectId.isValid(productId) ||
    !mongoose.Types.ObjectId.isValid(vendorId)
  ) {
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
    $or: [
      { name: regex },
      { description: regex },
      { comfortTags: regex },
      { slug: regex },
    ],
  };

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .skip(skip)
    .limit(limit)
    .populate("vendorId", "businessName")
    .populate("categoryId", "name");

  return { total, page, limit, products };
};

const deleteProduct = async (vendorId, productId) => {
  const product = await Product.findOneAndDelete({ _id: productId, vendorId });
  if (!product) throw new Error("Product not found or unauthorized");
  return product;
};

const updateProduct = async (vendorId, productId, updates) => {
  if (updates.categoryId) {
    const categoryExists = await Category.findById(updates.categoryId);
    if (!categoryExists) throw new Error("Category not found");
  }

  const variantStock = Array.isArray(updates.variants)
    ? updates.variants.reduce((sum, v) => sum + Number(v.stock || 0), 0)
    : 0;

  const baseStock = Number(updates.stock || 0);
  updates.stock = baseStock + variantStock;

  updates.price = Number(updates.price || 0);
  updates.commissionRate = Number(updates.commissionRate || 0);

  const product = await Product.findOneAndUpdate(
    { _id: productId, vendorId },
    updates,
    { new: true, runValidators: true }
  );

  if (!product) throw new Error("Product not found or unauthorized");

  return product;
};

const listVendorProducts = async (vendorId) => {
  return await Product.find({ vendorId })
    .populate("categoryId", "name")
    .sort("-createdAt");
};

const getProductsByVendor = async (vendorId) => {
  return await Product.find({ vendorId })
    .populate("categoryId")
    .populate("vendorId")
    .sort("-createdAt");
};

export default {
  addProduct,
  listProducts,
  getProductById,
  toggleProductStatus,
  searchProducts,
  deleteProduct,
  updateProduct,
  listVendorProducts,
  getProductsByVendor,
};
