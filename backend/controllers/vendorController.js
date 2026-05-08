const db = require("../config/db");

// Get all vendors
exports.getVendors = (req, res) => {
  db.query("SELECT * FROM vendors ORDER BY name ASC", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Get vendor by ID
exports.getVendorById = (req, res) => {
  db.query("SELECT * FROM vendors WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: "Vendor not found" });
    res.json(result[0]);
  });
};

// Create vendor
exports.createVendor = (req, res) => {
  const { name, type, contact, email, location } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: "name is required" });
  }

  const sql = "INSERT INTO vendors (name, type, contact, email, location) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [name, type || '', contact || '', email || '', location || ''], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ 
      id: result.insertId, 
      name, 
      type
    });
  });
};

// Update vendor
exports.updateVendor = (req, res) => {
  const { name, type, contact, email, location } = req.body;
  const sql = "UPDATE vendors SET name=?, type=?, contact=?, email=?, location=? WHERE id=?";
  
  db.query(sql, [name, type, contact, email, location, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Vendor not found" });
    res.json({ message: "Vendor updated successfully" });
  });
};

// Delete vendor
exports.deleteVendor = (req, res) => {
  db.query("DELETE FROM vendors WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Vendor not found" });
    res.json({ message: "Vendor deleted successfully" });
  });
};

// Search vendors
exports.searchVendors = (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: "search query is required" });
  }

  const searchQuery = `%${query}%`;
  const sql = "SELECT * FROM vendors WHERE name LIKE ? OR location LIKE ? OR type LIKE ? ORDER BY name ASC";
  
  db.query(sql, [searchQuery, searchQuery, searchQuery], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Get vendors by city
exports.getVendorsByCity = (req, res) => {
  const { city } = req.params;
  
  db.query("SELECT * FROM vendors WHERE location = ? ORDER BY name ASC", [city], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Get vendor statistics
exports.getVendorStats = (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) as total_vendors,
      COUNT(DISTINCT location) as cities_covered
    FROM vendors
  `;
  
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0] || {});
  });
};

// Rate vendor
exports.rateVendor = (req, res) => {
  res.json({ message: "Rating is not supported in the current schema", rating: req.body.rating });
};
