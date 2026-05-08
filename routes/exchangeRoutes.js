// Exchange / Buyback System
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create exchange request
router.post('/', (req, res) => {
  const { customer_name, old_product_desc, estimated_value } = req.body;
  if (!customer_name || !old_product_desc || !estimated_value) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const status = 'pending';
  db.query('INSERT INTO exchange_requests (customer_name, old_product_desc, estimated_value, status) VALUES (?, ?, ?, ?)', [customer_name, old_product_desc, estimated_value, status], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, status });
  });
});

// Get all exchange requests
router.get('/', (req, res) => {
  db.query('SELECT * FROM exchange_requests', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Update exchange request status
router.put('/:id', (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  if (!status) return res.status(400).json({ error: 'Missing status' });
  db.query('UPDATE exchange_requests SET status = ? WHERE id = ?', [status, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, status });
  });
});

module.exports = router;
