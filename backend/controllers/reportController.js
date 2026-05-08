const pool = require("../models/db");
const { getUserIdFromRequest } = require("../utils/customerContext");

const reportController = {
  async generateSalesReportCSV(req, res) {
    try {
      const userId = getUserIdFromRequest(req);
      
      // Check user role
      const [userRows] = await pool.query("SELECT role FROM users WHERE id = ?", [userId]);
      if (!userRows.length) return res.status(404).json({ error: "User not found" });
      
      const role = userRows[0].role;
      if (!['admin', 'staff', 'inventory_manager'].includes(role)) {
        return res.status(403).json({ error: "Unauthorized access to reports" });
      }

      // Fetch sales data
      const [rows] = await pool.query(`
        SELECT 
          o.id as order_id,
          o.customer_name,
          o.customer_email,
          o.total_price,
          o.status,
          o.payment_method,
          o.created_at,
          oi.quantity,
          oi.unit_price,
          p.name as product_name
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        ORDER BY o.created_at DESC
      `);

      // Convert to CSV
      const header = "Order ID,Customer Name,Email,Product,Quantity,Unit Price,Total Price,Status,Payment Method,Date\n";
      const csvRows = rows.map(r => {
        return `${r.order_id},"${r.customer_name}","${r.customer_email}","${r.product_name}",${r.quantity},${r.unit_price},${r.total_price},${r.status},${r.payment_method},"${new Date(r.created_at).toLocaleString()}"`;
      });

      const csvContent = header + csvRows.join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=sales_report.csv");
      res.status(200).send(csvContent);

    } catch (error) {
      console.error("CSV Generation Error:", error);
      res.status(500).json({ error: "Failed to generate CSV report" });
    }
  }
};

module.exports = reportController;
