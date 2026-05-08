const express = require("express");
const router = express.Router();
const {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats,
  getExpensesByCategory,
  getExpensesByStatus,
  getExpensesByDateRange,
  getExpenseCategories,
  getMonthlyExpenseSummary,
  approveExpense,
  rejectExpense
} = require("../controllers/expenseController");

// GET stats
router.get("/stats", getExpenseStats);

// GET monthly summary
router.get("/monthly-summary", getMonthlyExpenseSummary);

// GET categories
router.get("/categories", getExpenseCategories);

// GET by category
router.get("/category/:category", getExpensesByCategory);

// GET by status
router.get("/status/:status", getExpensesByStatus);

// GET by date range
router.get("/date-range", getExpensesByDateRange);

// GET all expenses
router.get("/", getAllExpenses);

// GET expense by ID
router.get("/:id", getExpenseById);

// CREATE expense
router.post("/", createExpense);

// UPDATE expense
router.put("/:id", updateExpense);

// APPROVE expense
router.put("/:id/approve", approveExpense);

// REJECT expense
router.put("/:id/reject", rejectExpense);

// DELETE expense
router.delete("/:id", deleteExpense);

module.exports = router;
