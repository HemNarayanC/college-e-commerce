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

export {addCategory}
