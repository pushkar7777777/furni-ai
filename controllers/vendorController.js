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
  const { name, contact_person, email, phone, address, city, rating } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: "name is required" });
  }

  const sql = "INSERT INTO vendors (name, contact_person, email, phone, address, city, rating) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, [name, contact_person || '', email || '', phone || '', address || '', city || '', rating || 0], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ 
      id: result.insertId, 
      name, 
      contact_person
    });
  });
};

// Update vendor
exports.updateVendor = (req, res) => {
  const { name, contact_person, email, phone, address, city, rating } = req.body;
  const sql = "UPDATE vendors SET name=?, contact_person=?, email=?, phone=?, address=?, city=?, rating=? WHERE id=?";
  
  db.query(sql, [name, contact_person, email, phone, address, city, rating, req.params.id], (err, result) => {
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
  const sql = "SELECT * FROM vendors WHERE name LIKE ? OR city LIKE ? OR contact_person LIKE ? ORDER BY name ASC";
  
  db.query(sql, [searchQuery, searchQuery, searchQuery], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Get vendors by city
exports.getVendorsByCity = (req, res) => {
  const { city } = req.params;
  
  db.query("SELECT * FROM vendors WHERE city = ? ORDER BY name ASC", [city], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Get vendor statistics
exports.getVendorStats = (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) as total_vendors,
      AVG(rating) as average_rating,
      COUNT(DISTINCT city) as cities_covered,
      MAX(rating) as highest_rating,
      MIN(rating) as lowest_rating
    FROM vendors
  `;
  
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0] || {});
  });
};

// Rate vendor
exports.rateVendor = (req, res) => {
  const { rating } = req.body;
  
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "rating must be between 1 and 5" });
  }

  db.query("UPDATE vendors SET rating = ? WHERE id = ?", [rating, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Vendor not found" });
    res.json({ message: "Vendor rating updated", rating });
  });
};
