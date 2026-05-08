const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET /products/search - Smart Search and Filtering
router.get("/search", (req, res) => {
  try {
    const { search, minPrice, maxPrice, material, color, sort } = req.query;

    let sql = "SELECT * FROM products WHERE 1=1";
    const params = [];

    if (search) {
      sql += " AND name LIKE ?";
      params.push(`%${search}%`);
    }

    if (minPrice) {
      sql += " AND price >= ?";
      params.push(minPrice);
    }
    if (maxPrice) {
      sql += " AND price <= ?";
      params.push(maxPrice);
    }

    if (material) {
      sql += " AND material = ?";
      params.push(material);
    }

    if (color) {
      sql += " AND color = ?";
      params.push(color);
    }

    if (sort === "price_asc") {
      sql += " ORDER BY price ASC";
    } else if (sort === "price_desc") {
      sql += " ORDER BY price DESC";
    } else if (sort === "newest") {
      sql += " ORDER BY id DESC";
    }

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to fetch products", details: err.message });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// GET /products - Fetch all products
router.get("/", (req, res) => {
  try {
    const sql = "SELECT * FROM products";
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to fetch products", details: err.message });
      }
      res.status(200).json(result);
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// GET /products/:id - Fetch product with reviews
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Valid product ID is required" });
    }

    db.query("SELECT * FROM products WHERE id = ?", [id], (err, products) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to fetch product", details: err.message });
      }

      if (!products.length) {
        return res.status(404).json({ error: "Product not found" });
      }

      db.query("SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC", [id], (reviewErr, reviews) => {
        if (reviewErr) {
          console.error("Database error:", reviewErr);
          return res.status(500).json({ error: "Failed to fetch product reviews", details: reviewErr.message });
        }

        const product = products[0];
        const avgRating = reviews.length
          ? reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length
          : null;

        res.status(200).json({
          ...product,
          reviews,
          avgRating
        });
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// POST /products - Insert a new product
router.post("/", (req, res) => {
  try {
    const { name, price, material, color, stock, image_url, description, category_id } = req.body;

    // Validation
    if (!name || !price || !material || !color || stock === undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const sql = "INSERT INTO products (name, price, material, color, stock, image_url, description, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [name, price, material, color, stock, image_url || null, description || null, category_id || null], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to add product", details: err.message });
      }
      res.status(201).json({ 
        message: "Product added successfully", 
        id: result.insertId,
        product: { id: result.insertId, name, price, material, color, stock, image_url, description, category_id }
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// DELETE /products/:id - Delete a product by ID
router.delete("/:id", (req, res) => {
  try {
    const { id } = req.params;

    // Validation
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Valid product ID is required" });
    }

    const sql = "DELETE FROM products WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to delete product", details: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json({ 
        message: "Product deleted successfully",
        id: id
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// PUT /products/:id - Update a product by ID
router.put("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, material, color, stock, image_url, description, category_id } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Valid product ID is required" });
    }
    if (!name || price === undefined || !material || !color || stock === undefined) {
      return res.status(400).json({ error: "name, price, material, color, and stock are required" });
    }

    const sql = `
      UPDATE products
      SET name = ?, price = ?, material = ?, color = ?, stock = ?, image_url = ?, description = ?, category_id = ?
      WHERE id = ?
    `;
    db.query(
      sql,
      [
        name,
        Number(price),
        material,
        color,
        Number(stock),
        image_url || null,
        description || null,
        category_id || null,
        id
      ],
      (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to update product", details: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json({
        message: "Product updated successfully",
        id,
        updated: { name, price: Number(price), material, color, stock: Number(stock), image_url: image_url || null, description: description || null, category_id: category_id || null }
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

module.exports = router;
