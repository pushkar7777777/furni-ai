const db = require("../config/db");

// Get all categories
exports.getCategories = (req, res) => {
  db.query("SELECT * FROM categories ORDER BY name ASC", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Get category by ID
exports.getCategoryById = (req, res) => {
  db.query("SELECT * FROM categories WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: "Category not found" });
    res.json(result[0]);
  });
};

// Create category
exports.createCategory = (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: "name is required" });
  }

  const sql = "INSERT INTO categories (name, description) VALUES (?, ?)";
  db.query(sql, [name, description || ''], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: "Category name already exists" });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ 
      id: result.insertId, 
      name, 
      description: description || ''
    });
  });
};

// Update category
exports.updateCategory = (req, res) => {
  const { name, description } = req.body;
  const sql = "UPDATE categories SET name=?, description=? WHERE id=?";
  
  db.query(sql, [name, description, req.params.id], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: "Category name already exists" });
      }
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category updated successfully" });
  });
};

// Delete category
exports.deleteCategory = (req, res) => {
  db.query("DELETE FROM categories WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted successfully" });
  });
};

// Get products by category
exports.getProductsByCategory = (req, res) => {
  const { categoryId } = req.params;
  
  db.query("SELECT * FROM products WHERE category_id = ? ORDER BY name ASC", [categoryId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Get category statistics
exports.getCategoryStats = (req, res) => {
  const sql = `
    SELECT 
      c.id,
      c.name,
      COUNT(p.id) as product_count,
      SUM(p.stock) as total_stock,
      SUM(p.stock * p.price) as category_value
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id
    GROUP BY c.id, c.name
    ORDER BY product_count DESC
  `;
  
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};
