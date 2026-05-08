// Rental System
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create rental
router.post('/', (req, res) => {
  const { product_id, monthly_rent, duration, customer_name } = req.body;
  if (!product_id || !monthly_rent || !duration || !customer_name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const status = 'active';
  db.query('INSERT INTO rentals (product_id, monthly_rent, duration, customer_name, status) VALUES (?, ?, ?, ?, ?)', [product_id, monthly_rent, duration, customer_name, status], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, status });
  });
});

// Get all rentals
router.get('/', (req, res) => {
  db.query('SELECT * FROM rentals', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
