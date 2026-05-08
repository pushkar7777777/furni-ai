const express = require("express");
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getProductsByCategory,
  getCategoryStats
} = require("../controllers/categoryController");

// GET stats
router.get("/stats", getCategoryStats);

// GET all categories
router.get("/", getCategories);

// GET category by ID
router.get("/:id", getCategoryById);

// GET products by category
router.get("/:categoryId/products", getProductsByCategory);

// CREATE category
router.post("/", createCategory);

// UPDATE category
router.put("/:id", updateCategory);

// DELETE category
router.delete("/:id", deleteCategory);

module.exports = router;
