const OrderModel = require("../models/orderModel");
const { getUserIdFromRequest } = require("../utils/customerContext");

const orderController = {
  async create(req, res) {
    try {
      const userId = getUserIdFromRequest(req);
      const order = await OrderModel.createFromCart(userId, req.body || {});
      res.status(201).json({
        success: true,
        message: "Order placed successfully",
        ...order
      });
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message || "Order failed" });
    }
  },

  async getAll(req, res) {
    try {
      const userId = getUserIdFromRequest(req);
      const orders = await OrderModel.getAllByUser(userId);
      res.json(orders);
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message || "Failed to fetch orders" });
    }
  },

  async getById(req, res) {
    try {
      const userId = getUserIdFromRequest(req);
      const order = await OrderModel.getById(userId, req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message || "Failed to fetch order" });
    }
  },

  async cancel(req, res) {
    try {
      const userId = getUserIdFromRequest(req);
      const result = await OrderModel.cancel(userId, req.params.id);
      if (!result) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json({ success: true, message: "Order cancelled successfully" });
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message || "Failed to cancel order" });
    }
  }
};

module.exports = orderController;
