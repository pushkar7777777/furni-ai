const db = require("../config/db");

// Get all employees
exports.getAllEmployees = (req, res) => {
  db.query("SELECT * FROM employees ORDER BY created_at DESC", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Get employee by ID
exports.getEmployeeById = (req, res) => {
  db.query("SELECT * FROM employees WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: "Employee not found" });
    res.json(result[0]);
  });
};

// Get employee statistics
exports.getEmployeeStats = (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) as total_employees,
      SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active_employees,
      SUM(CASE WHEN status IN ('Inactive', 'Terminated') THEN 1 ELSE 0 END) as inactive_employees,
      COUNT(DISTINCT role) as total_roles
    FROM employees
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0] || {});
  });
};

// Create employee
exports.createEmployee = (req, res) => {
  const { name, role, email, phone, status, join_date } = req.body;
  
  if (!name || !role) {
    return res.status(400).json({ error: "name and role are required" });
  }

  const sql = "INSERT INTO employees (name, role, email, phone, status, join_date) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [name, role, email, phone, status || 'Active', join_date || new Date().toISOString().split('T')[0]], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: "Email already exists" });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ 
      id: result.insertId, 
      name, 
      role, 
      email,
      status: status || 'Active'
    });
  });
};

// Update employee
exports.updateEmployee = (req, res) => {
  const { name, role, email, phone, status, join_date } = req.body;
  if (!name || !role) {
    return res.status(400).json({ error: "name and role are required" });
  }

  const sql = "UPDATE employees SET name=?, role=?, email=?, phone=?, status=?, join_date=? WHERE id=?";
  
  db.query(sql, [name, role, email, phone, status, join_date, req.params.id], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: "Email already exists" });
      }
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: "Employee not found" });
    res.json({ message: "Employee updated successfully" });
  });
};

// Delete employee
exports.deleteEmployee = (req, res) => {
  db.query("DELETE FROM employees WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Employee not found" });
    res.json({ message: "Employee deleted successfully" });
  });
};

// Get employees by role
exports.getEmployeesByRole = (req, res) => {
  db.query("SELECT * FROM employees WHERE role = ? ORDER BY name ASC", [req.params.role], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Get employees by status
exports.getEmployeesByStatus = (req, res) => {
  db.query("SELECT * FROM employees WHERE status = ? ORDER BY name ASC", [req.params.status], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Search employees
exports.searchEmployees = (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: "search query is required" });
  }

  const searchQuery = `%${query}%`;
  const sql = "SELECT * FROM employees WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? ORDER BY name ASC";
  
  db.query(sql, [searchQuery, searchQuery, searchQuery], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Get all distinct roles
exports.getAllRoles = (req, res) => {
  db.query("SELECT DISTINCT role FROM employees ORDER BY role ASC", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result.map(r => r.role));
  });
};
