const pool = require("./db");

const CartModel = {
  async add(userId, product_id, quantity) {
    const parsedProductId = Number(product_id);
    const parsedQuantity = Number(quantity) || 1;

    const [products] = await pool.query(
      "SELECT id, stock FROM products WHERE id = ?",
      [parsedProductId]
    );

    if (!products.length) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    const [existingItems] = await pool.query(
      "SELECT id, quantity FROM cart WHERE product_id = ? AND user_id = ?",
      [parsedProductId, userId]
    );

    const nextQuantity = existingItems.length
      ? Number(existingItems[0].quantity) + parsedQuantity
      : parsedQuantity;

    if (nextQuantity > Number(products[0].stock)) {
      const error = new Error("Requested quantity exceeds available stock");
      error.statusCode = 400;
      throw error;
    }

    if (existingItems.length) {
      await pool.query("UPDATE cart SET quantity = ? WHERE id = ?", [
        nextQuantity,
        existingItems[0].id
      ]);
      return { id: existingItems[0].id, quantity: nextQuantity };
    }

    const [result] = await pool.query(
      "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
      [userId, parsedProductId, parsedQuantity]
    );

    return { id: result.insertId, quantity: parsedQuantity };
  },

  async getAll(userId) {
    const [rows] = await pool.query(`
      SELECT
        cart.id,
        cart.product_id,
        cart.quantity,
        products.name,
        products.price,
        products.image_url,
        products.material,
        products.color,
        products.stock
      FROM cart
      JOIN products ON cart.product_id = products.id
      WHERE cart.user_id = ?
      ORDER BY cart.id DESC
    `, [userId]);

    return rows;
  },

  async updateQuantity(userId, id, quantity) {
    const parsedId = Number(id);
    const parsedQuantity = Number(quantity);

    if (!parsedQuantity || parsedQuantity < 1) {
      const error = new Error("Quantity must be at least 1");
      error.statusCode = 400;
      throw error;
    }

    const [items] = await pool.query(`
      SELECT cart.id, products.stock
      FROM cart
      JOIN products ON cart.product_id = products.id
      WHERE cart.id = ? AND cart.user_id = ?
    `, [parsedId, userId]);

    if (!items.length) {
      const error = new Error("Cart item not found");
      error.statusCode = 404;
      throw error;
    }

    if (parsedQuantity > Number(items[0].stock)) {
      const error = new Error("Requested quantity exceeds available stock");
      error.statusCode = 400;
      throw error;
    }

    await pool.query("UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?", [
      parsedQuantity,
      parsedId,
      userId
    ]);
  },

  async remove(userId, id) {
    await pool.query("DELETE FROM cart WHERE id = ? AND user_id = ?", [id, userId]);
  },

  async clear(userId) {
    await pool.query("DELETE FROM cart WHERE user_id = ?", [userId]);
  }
};

module.exports = CartModel;
