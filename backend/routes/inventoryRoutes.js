const express = require("express");
const router = express.Router();
const {
  getInventoryLogs,
  getLowStockProducts,
  getInventoryStats,
  updateStock,
  getProductStock,
  getAllProductsStock,
  getInventoryReport
} = require("../controllers/inventoryController");

// GET stats
router.get("/stats", getInventoryStats);

// GET all products stock
router.get("/all-stock", getAllProductsStock);

// GET low-stock products
router.get("/low-stock", getLowStockProducts);

// GET inventory logs
router.get("/logs", getInventoryLogs);

// GET inventory report
router.get("/report", getInventoryReport);

// GET product stock
router.get("/:id", getProductStock);

// POST update stock
router.post("/update", updateStock);

module.exports = router;
