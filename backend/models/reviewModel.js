const pool = require("./db");

const ReviewModel = {
  async add({ product_id, rating, comment, user_id, reviewer_name }) {
    const [result] = await pool.query(
      "INSERT INTO reviews (product_id, rating, comment, user_id, reviewer_name) VALUES (?, ?, ?, ?, ?)",
      [product_id, rating, comment, user_id, reviewer_name]
    );
    return { id: result.insertId };
  },

  async update({ id, rating, comment, user_id }) {
    const [result] = await pool.query(
      "UPDATE reviews SET rating = ?, comment = ? WHERE id = ? AND user_id = ?",
      [rating, comment, id, user_id]
    );
    return result.affectedRows;
  },

  async remove({ id, user_id }) {
    const [result] = await pool.query(
      "DELETE FROM reviews WHERE id = ? AND user_id = ?",
      [id, user_id]
    );
    return result.affectedRows;
  },

  async getByProduct(product_id) {
    const [rows] = await pool.query(
      "SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC",
      [product_id]
    );
    return rows;
  },

  async getAverageRating(product_id) {
    const [rows] = await pool.query(
      "SELECT AVG(rating) as avg_rating FROM reviews WHERE product_id = ?",
      [product_id]
    );
    return rows[0].avg_rating;
  }
};

module.exports = ReviewModel;
