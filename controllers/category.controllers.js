const Category = require("../models/category");
const { errorHandler } = require("../helpers/dbErrorHandler");

// Create a category
exports.create = async (req, res) => {
  if (!req?.body?.categoryName) {
    return res.status(400).json({
      error: "Category name is required",
    });
  }
  const category = new Category(req.body);
  try {
    const result = await category.save();
    // 201 created
    res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  const categories = await Category.find();

  // No categories found
  if (!categories)
    return res.status(204).json({
      error: "No categories found",
    });
  res.json(categories);
};
