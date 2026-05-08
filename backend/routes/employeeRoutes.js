const express = require("express");
const router = express.Router();
const {
  getAllEmployees,
  getEmployeeById,
  getEmployeeStats,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByRole,
  getEmployeesByStatus,
  searchEmployees,
  getAllRoles
} = require("../controllers/employeeController");

// GET stats
router.get("/stats", getEmployeeStats);

// GET all roles
router.get("/roles/all", getAllRoles);

// GET employees by role
router.get("/role/:role", getEmployeesByRole);

// GET employees by status
router.get("/status/:status", getEmployeesByStatus);

// SEARCH employees
router.get("/search", searchEmployees);

// GET all employees
router.get("/", getAllEmployees);

// GET employee by ID
router.get("/:id", getEmployeeById);

// CREATE employee
router.post("/", createEmployee);

// UPDATE employee
router.put("/:id", updateEmployee);

// DELETE employee
router.delete("/:id", deleteEmployee);

module.exports = router;
