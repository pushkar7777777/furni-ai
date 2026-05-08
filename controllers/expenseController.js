const db = require("../config/db");

// Get all expenses
exports.getAllExpenses = (req, res) => {
  db.query("SELECT * FROM expenses ORDER BY date DESC, created_at DESC", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Get expense by ID
exports.getExpenseById = (req, res) => {
  db.query("SELECT * FROM expenses WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: "Expense not found" });
    res.json(result[0]);
  });
};

// Create expense
exports.createExpense = (req, res) => {
  const { category, description, amount, date, status } = req.body;
  
  if (!category || !amount) {
    return res.status(400).json({ error: "category and amount are required" });
  }

  const sql = "INSERT INTO expenses (category, description, amount, date, status) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [category, description || '', amount, date || new Date().toISOString().split('T')[0], status || 'pending'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ 
      id: result.insertId, 
      category, 
      amount,
      status: status || 'pending'
    });
  });
};

// Update expense
exports.updateExpense = (req, res) => {
  const { category, description, amount, date, status } = req.body;
  const sql = "UPDATE expenses SET category=?, description=?, amount=?, date=?, status=? WHERE id=?";
  
  db.query(sql, [category, description, amount, date, status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Expense not found" });
    res.json({ message: "Expense updated successfully" });
  });
};

// Delete expense
exports.deleteExpense = (req, res) => {
  db.query("DELETE FROM expenses WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Expense not found" });
    res.json({ message: "Expense deleted successfully" });
  });
};

// Get expense statistics
exports.getExpenseStats = (req, res) => {
  const { startDate, endDate } = req.query;
  
  let sql = `
    SELECT 
      COUNT(*) as total_expenses,
      SUM(amount) as total_amount,
      AVG(amount) as average_amount,
      MAX(amount) as max_amount,
      MIN(amount) as min_amount,
      category,
      SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) as approved_amount,
      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_amount,
      SUM(CASE WHEN status = 'rejected' THEN amount ELSE 0 END) as rejected_amount
    FROM expenses
    WHERE 1=1
  `;
  
  const params = [];
  
  if (startDate) {
    sql += " AND date >= ?";
    params.push(startDate);
  }
  
  if (endDate) {
    sql += " AND date <= ?";
    params.push(endDate);
  }
  
  sql += " GROUP BY category";
  
  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result || []);
  });
};

// Get expenses by category
exports.getExpensesByCategory = (req, res) => {
  const { category } = req.params;
  
  db.query("SELECT * FROM expenses WHERE category = ? ORDER BY date DESC", [category], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Get expenses by status
exports.getExpensesByStatus = (req, res) => {
  const { status } = req.params;
  
  db.query("SELECT * FROM expenses WHERE status = ? ORDER BY date DESC", [status], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Get expenses within date range
exports.getExpensesByDateRange = (req, res) => {
  const { startDate, endDate } = req.query;
  
  if (!startDate || !endDate) {
    return res.status(400).json({ error: "startDate and endDate are required" });
  }

  db.query(
    "SELECT * FROM expenses WHERE date >= ? AND date <= ? ORDER BY date DESC",
    [startDate, endDate],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
};

// Get expense categories
exports.getExpenseCategories = (req, res) => {
  db.query("SELECT DISTINCT category FROM expenses ORDER BY category ASC", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result.map(r => r.category));
  });
};

// Get monthly expense summary
exports.getMonthlyExpenseSummary = (req, res) => {
  const sql = `
    SELECT 
      DATE_FORMAT(date, '%Y-%m') as month,
      SUM(amount) as total_amount,
      COUNT(*) as count
    FROM expenses
    WHERE status = 'approved'
    GROUP BY DATE_FORMAT(date, '%Y-%m')
    ORDER BY month DESC
    LIMIT 12
  `;
  
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Approve expense
exports.approveExpense = (req, res) => {
  db.query("UPDATE expenses SET status = 'approved' WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Expense not found" });
    res.json({ message: "Expense approved" });
  });
};

// Reject expense
exports.rejectExpense = (req, res) => {
  const { reason } = req.body;
  db.query("UPDATE expenses SET status = 'rejected' WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Expense not found" });
    res.json({ message: "Expense rejected", reason });
  });
};
