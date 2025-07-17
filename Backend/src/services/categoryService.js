// services/categoryService.js
import Category from "../models/Category.js";

const addCategory = async (name) => {
  const existing = await Category.findOne({ name });
  if (existing) throw new Error("Category already exists");

  const category = new Category({ name });
  return await category.save();
};

const getAllCategories = async () => {
  return await Category.find().sort({ name: 1 });
};


export default {
  addCategory,
  getAllCategories
};
