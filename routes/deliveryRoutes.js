// Delivery & Installation Tracking
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all deliveries
router.get('/', (req, res) => {
  db.query('SELECT * FROM deliveries', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Update delivery status or installation date
router.put('/:id', (req, res) => {
  const { status, installation_date } = req.body;
  const { id } = req.params;
  if (!status && !installation_date) return res.status(400).json({ error: 'Nothing to update' });
  let fields = [];
  let values = [];
  if (status) { fields.push('status = ?'); values.push(status); }
  if (installation_date) { fields.push('installation_date = ?'); values.push(installation_date); }
  values.push(id);
  db.query(`UPDATE deliveries SET ${fields.join(', ')} WHERE id = ?`, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, status, installation_date });
  });
});

module.exports = router;
