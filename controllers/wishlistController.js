const WishlistModel = require("../models/wishlistModel");
const { getUserIdFromRequest } = require("../utils/customerContext");

const wishlistController = {
  async add(req, res) {
    try {
      const userId = getUserIdFromRequest(req);
      const { product_id } = req.body;
      await WishlistModel.add(userId, product_id);
      const items = await WishlistModel.getAll(userId);
      res.json({ success: true, message: "Added to wishlist", items });
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message || "Failed to add to wishlist" });
    }
  },
  async getAll(req, res) {
    try {
      const userId = getUserIdFromRequest(req);
      const items = await WishlistModel.getAll(userId);
      res.json(items);
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message || "Failed to fetch wishlist" });
    }
  },
  async remove(req, res) {
    try {
      const userId = getUserIdFromRequest(req);
      await WishlistModel.remove(userId, req.params.id);
      const items = await WishlistModel.getAll(userId);
      res.json({ success: true, message: "Removed from wishlist", items });
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message || "Failed to remove item" });
    }
  }
};

module.exports = wishlistController;
