const express = require("express");
const router = express.Router();
const {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
  searchVendors,
  getVendorsByCity,
  getVendorStats,
  rateVendor
} = require("../controllers/vendorController");

// GET stats
router.get("/stats", getVendorStats);

// GET search
router.get("/search", searchVendors);

// GET all vendors
router.get("/", getVendors);

// GET vendors by city
router.get("/city/:city", getVendorsByCity);

// GET vendor by ID
router.get("/:id", getVendorById);

// CREATE vendor
router.post("/", createVendor);

// UPDATE vendor
router.put("/:id", updateVendor);

// RATE vendor
router.put("/:id/rate", rateVendor);

// DELETE vendor
router.delete("/:id", deleteVendor);

module.exports = router;
