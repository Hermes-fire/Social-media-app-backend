const express = require("express");
const { verifyToken } = require("../controllers/auth");
const router = express.Router();

const {
  create,
  getAllCategories,
} = require("../controllers/category.controllers");

// create category
router.post("/categories/create", verifyToken, create);

// Get all categories
router.get("/categories/", verifyToken, getAllCategories);

module.exports = router;
