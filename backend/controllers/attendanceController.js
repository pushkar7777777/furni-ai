const db = require("../config/db");

// Get attendance for a specific date
exports.getAttendanceByDate = (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0];
  const sql = `
    SELECT a.*, e.name as employee_name, e.role 
    FROM attendance a 
    JOIN employees e ON a.employee_id = e.id 
    WHERE a.date = ?
    ORDER BY e.name ASC
  `;
  db.query(sql, [date], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Get attendance history for a specific employee
exports.getEmployeeAttendance = (req, res) => {
  const { id } = req.params;
  const limit = req.query.limit || 30;
  
  db.query(
    "SELECT * FROM attendance WHERE employee_id = ? ORDER BY date DESC LIMIT ?",
    [id, parseInt(limit)],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
};

// Get attendance statistics
exports.getAttendanceStats = (req, res) => {
  const { startDate, endDate } = req.query;
  
  let sql = `
    SELECT 
      COUNT(*) as total_records,
      SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present_count,
      SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absent_count,
      SUM(CASE WHEN status = 'Late' THEN 1 ELSE 0 END) as late_count,
      SUM(CASE WHEN status = 'Leave' THEN 1 ELSE 0 END) as leave_count
    FROM attendance
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
  
  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0] || {});
  });
};

// Log/Update attendance
exports.logAttendance = (req, res) => {
  const { employee_id, date, status, check_in, check_out } = req.body;
  
  if (!employee_id || !date || !status) {
    return res.status(400).json({ error: "employee_id, date, and status are required" });
  }
  
  if (!["Present", "Absent", "Late", "Leave"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  // Check if employee exists
  db.query("SELECT id FROM employees WHERE id = ?", [employee_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: "Employee not found" });

    const sql = `
      INSERT INTO attendance (employee_id, date, status, check_in, check_out) 
      VALUES (?, ?, ?, ?, ?) 
      ON DUPLICATE KEY UPDATE status=?, check_in=?, check_out=?
    `;
    
    db.query(sql, [employee_id, date, status, check_in, check_out, status, check_in, check_out], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ 
        message: "Attendance logged successfully",
        attendance_id: result.insertId || result.warningCount
      });
    });
  });
};

// Get today's attendance summary
exports.getTodaysSummary = (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const sql = `
    SELECT 
      e.id,
      e.name,
      e.role,
      COALESCE(a.status, 'Unmarked') as attendance_status,
      a.check_in,
      a.check_out
    FROM employees e
    LEFT JOIN attendance a ON e.id = a.employee_id AND a.date = ?
    WHERE e.status = 'Active'
    ORDER BY e.name ASC
  `;
  
  db.query(sql, [today], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Mark check-in
exports.checkIn = (req, res) => {
  const { employee_id } = req.body;
  const today = new Date().toISOString().split('T')[0];
  const checkInTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
  
  if (!employee_id) {
    return res.status(400).json({ error: "employee_id is required" });
  }

  const sql = `
    INSERT INTO attendance (employee_id, date, status, check_in) 
    VALUES (?, ?, 'Present', ?) 
    ON DUPLICATE KEY UPDATE status='Present', check_in=?
  `;
  
  db.query(sql, [employee_id, today, checkInTime, checkInTime], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ 
      message: "Check-in recorded",
      check_in_time: checkInTime
    });
  });
};

// Mark check-out
exports.checkOut = (req, res) => {
  const { employee_id } = req.body;
  const today = new Date().toISOString().split('T')[0];
  const checkOutTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
  
  if (!employee_id) {
    return res.status(400).json({ error: "employee_id is required" });
  }

  const sql = `
    UPDATE attendance 
    SET check_out = ? 
    WHERE employee_id = ? AND date = ?
  `;
  
  db.query(sql, [checkOutTime, employee_id, today], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No check-in found for today" });
    }
    res.json({ 
      message: "Check-out recorded",
      check_out_time: checkOutTime
    });
  });
};

// Get attendance report
exports.getAttendanceReport = (req, res) => {
  const { startDate, endDate, employeeId } = req.query;
  
  let sql = `
    SELECT 
      a.*,
      e.name as employee_name,
      e.role
    FROM attendance a
    JOIN employees e ON a.employee_id = e.id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (startDate) {
    sql += " AND a.date >= ?";
    params.push(startDate);
  }
  
  if (endDate) {
    sql += " AND a.date <= ?";
    params.push(endDate);
  }
  
  if (employeeId) {
    sql += " AND a.employee_id = ?";
    params.push(employeeId);
  }
  
  sql += " ORDER BY a.date DESC, e.name ASC";
  
  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Get employee attendance percentage
exports.getAttendancePercentage = (req, res) => {
  const { employeeId, startDate, endDate } = req.query;
  
  if (!employeeId) {
    return res.status(400).json({ error: "employeeId is required" });
  }
  
  let sql = `
    SELECT 
      COUNT(*) as total_days,
      SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present_days,
      ROUND((SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as attendance_percentage
    FROM attendance
    WHERE employee_id = ? AND status IN ('Present', 'Absent')
  `;
  
  const params = [employeeId];
  
  if (startDate) {
    sql += " AND date >= ?";
    params.push(startDate);
  }
  
  if (endDate) {
    sql += " AND date <= ?";
    params.push(endDate);
  }
  
  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0] || {});
  });
};
