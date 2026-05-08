const pool = require("./db");

const WishlistModel = {
  async add(userId, productId) {
    const [existing] = await pool.query(
      "SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );

    if (existing.length) {
      return existing[0];
    }

    const [result] = await pool.query(
      "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)",
      [userId, productId]
    );

    return { id: result.insertId };
  },

  async getAll(userId) {
    const [rows] = await pool.query(`
      SELECT
        wishlist.id,
        wishlist.product_id,
        products.name,
        products.price,
        products.image_url,
        products.material,
        products.color,
        products.stock
      FROM wishlist
      JOIN products ON wishlist.product_id = products.id
      WHERE wishlist.user_id = ?
      ORDER BY wishlist.id DESC
    `, [userId]);

    return rows;
  },

  async remove(userId, id) {
    await pool.query("DELETE FROM wishlist WHERE id = ? AND user_id = ?", [id, userId]);
  }
};

module.exports = WishlistModel;
