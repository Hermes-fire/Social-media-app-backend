const express = require("express");
const router = express.Router();

const {
  create,
  getAllCategories,
} = require("../controllers/category.controllers");

// create category
router.post("/categories/create", create);

// Get all categories
router.get("/categories/", getAllCategories);

module.exports = router;
