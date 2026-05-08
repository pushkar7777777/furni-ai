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
  const { customer_name, customer_email, customer_phone, items, total_amount, status, notes } = req.body;
  
  if (!customer_name || !items || total_amount === undefined) {
    return res.status(400).json({ error: "customer_name, items, and total_amount are required" });
  }

  const sql = "INSERT INTO quotations (customer_name, customer_email, customer_phone, items, total_amount, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, [customer_name, customer_email || '', customer_phone || '', items, total_amount, status || 'pending', notes || ''], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ 
      id: result.insertId, 
      customer_name,
      status: status || 'pending'
    });
  });
};

// Update quotation
exports.updateQuotation = (req, res) => {
  const { customer_name, customer_email, customer_phone, items, total_amount, status, notes } = req.body;
  const sql = "UPDATE quotations SET customer_name=?, customer_email=?, customer_phone=?, items=?, total_amount=?, status=?, notes=? WHERE id=?";
  
  db.query(sql, [customer_name, customer_email, customer_phone, items, total_amount, status, notes, req.params.id], (err, result) => {
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

// Get quotations by vendor (fallback logic)
exports.getQuotationsByVendor = (req, res) => {
  const { vendorId } = req.params;
  
  db.query("SELECT * FROM quotations WHERE customer_name LIKE ? ORDER BY created_at DESC", [`%${vendorId}%`], (err, result) => {
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
      SUM(total_amount) as total_value,
      AVG(total_amount) as average_value
    FROM quotations
  `;
  
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0] || {});
  });
};
