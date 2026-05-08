// Service & Maintenance
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create service request
router.post('/', (req, res) => {
  const { customer_name, product_id, issue } = req.body;
  if (!customer_name || !product_id || !issue) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const status = 'pending';
  db.query('INSERT INTO service_requests (customer_name, product_id, issue, status) VALUES (?, ?, ?, ?)', [customer_name, product_id, issue, status], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, status });
  });
});

// Get all service requests
router.get('/', (req, res) => {
  db.query('SELECT * FROM service_requests', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Update service request status
router.put('/:id', (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  if (!status) return res.status(400).json({ error: 'Missing status' });
  db.query('UPDATE service_requests SET status = ? WHERE id = ?', [status, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, status });
  });
});

module.exports = router;
