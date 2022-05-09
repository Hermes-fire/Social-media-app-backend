const Category = require("../models/category");
const { errorHandler } = require("../helpers/dbErrorHandler");

// Create a category
exports.create = (req, res) => {
  console.log("im here");
  const category = new Category(req.body);
  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json({ data });
  });
};

// Get all categories
exports.getAllCategories = (req, res) => {
  Category.find().exec((err, data) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};
