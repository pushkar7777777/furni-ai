// Supplier / Vendor Management
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Add supplier
router.post('/', (req, res) => {
  const { name, contact, material_supplied } = req.body;
  if (!name || !contact || !material_supplied) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  db.query('INSERT INTO suppliers (name, contact, material_supplied) VALUES (?, ?, ?)', [name, contact, material_supplied], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId });
  });
});

// Get all suppliers
router.get('/', (req, res) => {
  db.query('SELECT * FROM suppliers', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
