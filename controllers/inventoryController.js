const db = require("../config/db");

// Get all inventory logs
exports.getInventoryLogs = (req, res) => {
  const sql = `
    SELECT il.*, p.name as product_name 
    FROM inventory_logs il
    JOIN products p ON il.product_id = p.id
    ORDER BY il.created_at DESC
    LIMIT 500
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Get low stock products
exports.getLowStockProducts = (req, res) => {
  const threshold = parseInt(req.query.threshold) || 10;
  db.query("SELECT * FROM products WHERE stock < ? ORDER BY stock ASC", [threshold], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Get inventory statistics
exports.getInventoryStats = (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) as total_products,
      SUM(stock) as total_units,
      SUM(stock * price) as total_stock_value,
      SUM(CASE WHEN stock < 10 THEN 1 ELSE 0 END) as low_stock_count,
      SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) as out_of_stock_count
    FROM products
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0] || {});
  });
};

// Update stock (IN or OUT)
exports.updateStock = (req, res) => {
  const { product_id, type, quantity, reference, notes } = req.body;
  const numericQuantity = Number(quantity);
  
  if (!product_id || !type || !quantity) {
    return res.status(400).json({ error: "product_id, type, and quantity are required" });
  }
  
  if (!["IN", "OUT"].includes(type)) {
    return res.status(400).json({ error: "type must be IN or OUT" });
  }
  
  if (!Number.isInteger(numericQuantity) || numericQuantity <= 0) {
    return res.status(400).json({ error: "quantity must be positive" });
  }

  // Check current stock if OUT
  db.query("SELECT stock FROM products WHERE id = ?", [product_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: "Product not found" });

    const currentStock = rows[0].stock;
    if (type === "OUT" && currentStock < numericQuantity) {
      return res.status(400).json({ error: `Insufficient stock. Available: ${currentStock}` });
    }

    const stockChange = type === "IN" ? numericQuantity : -numericQuantity;
    const newStock = currentStock + stockChange;
    const updateSql = "UPDATE products SET stock = stock + ? WHERE id = ?";

    db.query(updateSql, [stockChange, product_id], (err) => {
      if (err) return res.status(500).json({ error: err.message });

      const logSql = "INSERT INTO inventory_logs (product_id, type, quantity, reference, notes) VALUES (?, ?, ?, ?, ?)";
      db.query(logSql, [product_id, type, numericQuantity, reference || null, notes || null], (err, logResult) => {
        if (err) return res.status(500).json({ error: err.message });

        const alertSql = newStock < 10
          ? "INSERT INTO alerts (product_id, type, status) SELECT ?, 'stock', 'pending' WHERE NOT EXISTS (SELECT 1 FROM alerts WHERE product_id = ? AND type = 'stock' AND status = 'pending')"
          : "DELETE FROM alerts WHERE product_id = ? AND type = 'stock' AND status = 'pending'";
        const alertParams = newStock < 10 ? [product_id, product_id] : [product_id];

        db.query(alertSql, alertParams, (alertErr) => {
          if (alertErr) return res.status(500).json({ error: alertErr.message });
          res.status(201).json({
            message: `Stock ${type === "IN" ? "added" : "deducted"} successfully`,
            log_id: logResult.insertId,
            new_stock: newStock
          });
        });
      });
    });
  });
};

// Get product details with stock info
exports.getProductStock = (req, res) => {
  db.query("SELECT id, name, stock, price, image_url FROM products WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json(result[0]);
  });
};

// Get all products stock
exports.getAllProductsStock = (req, res) => {
  db.query("SELECT id, name, stock, price FROM products ORDER BY name ASC", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Generate inventory report
exports.getInventoryReport = (req, res) => {
  const { startDate, endDate, type } = req.query;
  
  let sql = `
    SELECT 
      il.*,
      p.name as product_name,
      p.price
    FROM inventory_logs il
    JOIN products p ON il.product_id = p.id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (startDate) {
    sql += " AND DATE(il.created_at) >= ?";
    params.push(startDate);
  }
  
  if (endDate) {
    sql += " AND DATE(il.created_at) <= ?";
    params.push(endDate);
  }
  
  if (type && ["IN", "OUT"].includes(type)) {
    sql += " AND il.type = ?";
    params.push(type);
  }
  
  sql += " ORDER BY il.created_at DESC";
  
  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};
