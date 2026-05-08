const express = require("express");
const router = express.Router();
const {
  getQuotations,
  getQuotationById,
  createQuotation,
  updateQuotation,
  updateQuotationStatus,
  deleteQuotation,
  getQuotationsByStatus,
  getQuotationsByVendor,
  getQuotationStats
} = require("../controllers/quotationController");

// GET stats
router.get("/stats", getQuotationStats);

// GET all quotations
router.get("/", getQuotations);

// GET quotations by status
router.get("/status/:status", getQuotationsByStatus);

// GET quotations by vendor
router.get("/vendor/:vendorId", getQuotationsByVendor);

// GET quotation by ID
router.get("/:id", getQuotationById);

// CREATE quotation
router.post("/", createQuotation);

// UPDATE quotation
router.put("/:id", updateQuotation);

// UPDATE quotation status
router.put("/:id/status", updateQuotationStatus);

// DELETE quotation
router.delete("/:id", deleteQuotation);

module.exports = router;
