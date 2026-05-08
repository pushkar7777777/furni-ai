const db = require("../config/db");

// Get all quotations
exports.getQuotations = (req, res) => {
  db.query("SELECT * FROM quotations ORDER BY created_at DESC", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Get quotation by ID
exports.getQuotationById = (req, res) => {
  db.query("SELECT * FROM quotations WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: "Quotation not found" });
    res.json(result[0]);
  });
};

// Create quotation
exports.createQuotation = (req, res) => {
  const { vendor_id, product_name, quantity, unit_price, total_price, status } = req.body;
  
  if (!vendor_id || !product_name || !quantity || !unit_price) {
    return res.status(400).json({ error: "vendor_id, product_name, quantity, and unit_price are required" });
  }

  const finalTotal = total_price || (quantity * unit_price);
  const sql = "INSERT INTO quotations (vendor_id, product_name, quantity, unit_price, total_price, status) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [vendor_id, product_name, quantity, unit_price, finalTotal, status || 'pending'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ 
      id: result.insertId, 
      vendor_id, 
      product_name,
      status: status || 'pending'
    });
  });
};

// Update quotation
exports.updateQuotation = (req, res) => {
  const { vendor_id, product_name, quantity, unit_price, total_price, status } = req.body;
  const sql = "UPDATE quotations SET vendor_id=?, product_name=?, quantity=?, unit_price=?, total_price=?, status=? WHERE id=?";
  
  db.query(sql, [vendor_id, product_name, quantity, unit_price, total_price, status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Quotation not found" });
    res.json({ message: "Quotation updated successfully" });
  });
};

// Update quotation status
exports.updateQuotationStatus = (req, res) => {
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ error: "status is required" });
  }

  db.query("UPDATE quotations SET status = ? WHERE id = ?", [status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Quotation not found" });
    res.json({ message: `Quotation status updated to ${status}` });
  });
};

// Delete quotation
exports.deleteQuotation = (req, res) => {
  db.query("DELETE FROM quotations WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Quotation not found" });
    res.json({ message: "Quotation deleted successfully" });
  });
};

// Get quotations by status
exports.getQuotationsByStatus = (req, res) => {
  const { status } = req.params;
  
  db.query("SELECT * FROM quotations WHERE status = ? ORDER BY created_at DESC", [status], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Get quotations by vendor
exports.getQuotationsByVendor = (req, res) => {
  const { vendorId } = req.params;
  
  db.query("SELECT * FROM quotations WHERE vendor_id = ? ORDER BY created_at DESC", [vendorId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Get quotation statistics
exports.getQuotationStats = (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) as total_quotations,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
      SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted_count,
      SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_count,
      SUM(total_price) as total_value,
      AVG(total_price) as average_value
    FROM quotations
  `;
  
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0] || {});
  });
};
