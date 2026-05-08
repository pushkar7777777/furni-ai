const pool = require("./db");

const ReceiptModel = {
  async create(orderId) {
    const receiptNumber = `FA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const [result] = await pool.query(
      "INSERT INTO receipts (order_id, receipt_number) VALUES (?, ?)",
      [orderId, receiptNumber]
    );
    return { id: result.insertId, receiptNumber };
  },

  async getByOrderId(orderId) {
    const [receipts] = await pool.query(
      "SELECT * FROM receipts WHERE order_id = ?",
      [orderId]
    );
    
    if (!receipts.length) return null;

    const [orders] = await pool.query(
      "SELECT * FROM orders WHERE id = ?",
      [orderId]
    );

    if (!orders.length) return null;

    const [items] = await pool.query(`
      SELECT 
        order_items.quantity,
        order_items.unit_price,
        products.name,
        products.image_url
      FROM order_items
      JOIN products ON order_items.product_id = products.id
      WHERE order_items.order_id = ?
    `, [orderId]);

    return {
      ...receipts[0],
      order: orders[0],
      items
    };
  },

  async ensureReceipt(orderId) {
    const existing = await this.getByOrderId(orderId);
    if (existing) return existing;
    await this.create(orderId);
    return this.getByOrderId(orderId);
  }
};

module.exports = ReceiptModel;
