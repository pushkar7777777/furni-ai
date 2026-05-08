// Offers & Discount System
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create offer
router.post('/', (req, res) => {
  const { code, discount_percent, expiry_date } = req.body;
  if (!code || !discount_percent || !expiry_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  db.query('INSERT INTO offers (code, discount_percent, expiry_date) VALUES (?, ?, ?)', [code, discount_percent, expiry_date], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId });
  });
});

// Get all offers
router.get('/', (req, res) => {
  db.query('SELECT * FROM offers', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
