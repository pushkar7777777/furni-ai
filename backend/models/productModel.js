const pool = require('./db');

const ProductModel = {
  async getAll(filters = {}) {
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    if (filters.minPrice) { sql += ' AND price >= ?'; params.push(filters.minPrice); }
    if (filters.maxPrice) { sql += ' AND price <= ?'; params.push(filters.maxPrice); }
    if (filters.material) { sql += ' AND material = ?'; params.push(filters.material); }
    if (filters.color) { sql += ' AND color = ?'; params.push(filters.color); }
    const [rows] = await pool.query(sql, params);
    return rows;
  },
  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
  },
  async updateStock(id, quantity) {
    await pool.query('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, id]);
  },
  // ...other product methods
};

module.exports = ProductModel;
