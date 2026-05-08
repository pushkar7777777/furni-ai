const CartModel = require("../models/cartModel");
const { getUserIdFromRequest } = require("../utils/customerContext");

const buildCartPayload = (items) => {
  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );
  const itemCount = items.reduce((sum, item) => sum + Number(item.quantity), 0);

  return { items, totalPrice, itemCount };
};

const cartController = {
  async add(req, res) {
    try {
      const userId = getUserIdFromRequest(req);
      const { product_id, quantity } = req.body;

      if (!product_id) {
        return res.status(400).json({ error: "product_id is required" });
      }

      await CartModel.add(userId, product_id, quantity || 1);
      const items = await CartModel.getAll(userId);

      res.status(201).json({
        success: true,
        message: "Item added to cart",
        ...buildCartPayload(items)
      });
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message || "Failed to add to cart" });
    }
  },

  async getAll(req, res) {
    try {
      const userId = getUserIdFromRequest(req);
      const items = await CartModel.getAll(userId);
      res.json(buildCartPayload(items));
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message || "Failed to fetch cart" });
    }
  },

  async update(req, res) {
    try {
      const userId = getUserIdFromRequest(req);
      const { id, quantity } = req.body;

      if (!id) {
        return res.status(400).json({ error: "id is required" });
      }

      await CartModel.updateQuantity(userId, id, quantity);
      const items = await CartModel.getAll(userId);

      res.json({
        success: true,
        message: "Cart updated",
        ...buildCartPayload(items)
      });
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message || "Failed to update cart" });
    }
  },

  async remove(req, res) {
    try {
      const userId = getUserIdFromRequest(req);
      await CartModel.remove(userId, req.params.id);
      const items = await CartModel.getAll(userId);

      res.json({
        success: true,
        message: "Item removed from cart",
        ...buildCartPayload(items)
      });
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message || "Failed to remove item" });
    }
  }
};

module.exports = cartController;
