const pool = require('./db');

const AlertModel = {
  async add(product_id, type) {
    await pool.query('INSERT INTO alerts (product_id, type) VALUES (?, ?)', [product_id, type]);
  },
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM alerts');
    return rows;
  },
  async trigger(product_id) {
    await pool.query("UPDATE alerts SET status = 'triggered' WHERE product_id = ? AND status = 'pending'", [product_id]);
  },
  async clearAll() {
    await pool.query('DELETE FROM alerts');
  }
};

module.exports = AlertModel;
