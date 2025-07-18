// controllers/categoryController.js
import categoryService from "../services/categoryService.js";

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await categoryService.addCategory(name);

    res.status(201).json({
      message: "Category added successfully",
      category: result,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

export {addCategory, getCategories}
