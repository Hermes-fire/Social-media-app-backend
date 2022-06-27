const express = require("express");
const { verifyToken } = require("../controllers/auth");
const router = express.Router();

const {
  create,
  getAllCategories,
} = require("../controllers/category.controllers");

// create category
router.post("/", verifyToken, create);
// Get all categories
router.get("/", verifyToken, getAllCategories);

module.exports = router;
