// EMI / Loan Management
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create EMI plan
router.post('/create', (req, res) => {
  const { customer_name, product_id, total_amount, down_payment, tenure } = req.body;
  if (!customer_name || !product_id || !total_amount || !down_payment || !tenure) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const monthly_emi = (total_amount - down_payment) / tenure;
  const remaining_amount = total_amount - down_payment;
  const status = 'active';
  const sql = `INSERT INTO emi_plans (customer_name, product_id, total_amount, down_payment, monthly_emi, tenure, remaining_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [customer_name, product_id, total_amount, down_payment, monthly_emi, tenure, remaining_amount, status], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, monthly_emi, remaining_amount, status });
  });
});

// Get all EMI plans
router.get('/', (req, res) => {
  db.query('SELECT * FROM emi_plans', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Pay EMI (reduce remaining_amount)
router.put('/pay', (req, res) => {
  const { id, amount } = req.body;
  if (!id || !amount) return res.status(400).json({ error: 'Missing id or amount' });
  db.query('SELECT * FROM emi_plans WHERE id = ?', [id], (err, rows) => {
    if (err || rows.length === 0) return res.status(404).json({ error: 'EMI plan not found' });
    let remaining = rows[0].remaining_amount - amount;
    let status = remaining <= 0 ? 'completed' : 'active';
    db.query('UPDATE emi_plans SET remaining_amount = ?, status = ? WHERE id = ?', [remaining, status, id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ id, remaining_amount: remaining, status });
    });
  });
});

module.exports = router;
