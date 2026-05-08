const db = require("../config/db");

// Get all offers
exports.getOffers = (req, res) => {
  db.query("SELECT * FROM offers ORDER BY created_at DESC", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Get active offers
exports.getActiveOffers = (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  db.query(
    "SELECT * FROM offers WHERE status = 'active' AND start_date <= ? AND end_date >= ? ORDER BY created_at DESC",
    [today, today],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
};

// Get offer by ID
exports.getOfferById = (req, res) => {
  db.query("SELECT * FROM offers WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: "Offer not found" });
    res.json(result[0]);
  });
};

// Create offer
exports.createOffer = (req, res) => {
  const { name, description, discount_percentage, start_date, end_date, status } = req.body;
  
  if (!name || !discount_percentage) {
    return res.status(400).json({ error: "name and discount_percentage are required" });
  }

  const sql = "INSERT INTO offers (name, description, discount_percentage, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [name, description || '', discount_percentage, start_date || null, end_date || null, status || 'active'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ 
      id: result.insertId, 
      name, 
      discount_percentage
    });
  });
};

// Update offer
exports.updateOffer = (req, res) => {
  const { name, description, discount_percentage, start_date, end_date, status } = req.body;
  const sql = "UPDATE offers SET name=?, description=?, discount_percentage=?, start_date=?, end_date=?, status=? WHERE id=?";
  
  db.query(sql, [name, description, discount_percentage, start_date, end_date, status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Offer not found" });
    res.json({ message: "Offer updated successfully" });
  });
};

// Delete offer
exports.deleteOffer = (req, res) => {
  db.query("DELETE FROM offers WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Offer not found" });
    res.json({ message: "Offer deleted successfully" });
  });
};

// Add product to offer
exports.addProductToOffer = (req, res) => {
  const { productId } = req.body;
  const { offerId } = req.params;
  
  if (!productId) {
    return res.status(400).json({ error: "productId is required" });
  }

  const sql = "INSERT INTO offer_products (offer_id, product_id) VALUES (?, ?)";
  db.query(sql, [offerId, productId], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: "Product already in this offer" });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Product added to offer" });
  });
};

// Get offer statistics
exports.getOfferStats = (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) as total_offers,
      SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_offers,
      AVG(discount_percentage) as average_discount
    FROM offers
  `;
  
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0] || {});
  });
};
