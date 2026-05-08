const ReviewModel = require("../models/reviewModel");
const { getUserIdFromRequest } = require("../utils/customerContext");

const reviewController = {
  async add(req, res) {
    try {
      const userId = getUserIdFromRequest(req);
      const { product_id, rating, comment, reviewer_name } = req.body;
      if (!product_id || !rating || !comment?.trim()) {
        return res.status(400).json({ error: "Product, rating, and comment are required" });
      }
      const review = await ReviewModel.add({
        product_id,
        rating: Number(rating),
        comment: comment.trim(),
        user_id: userId,
        reviewer_name
      });
      res.json({ success: true, review });
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message || "Failed to add review" });
    }
  },
  async update(req, res) {
    try {
      const userId = getUserIdFromRequest(req);
      if (!req.body.rating || !req.body.comment?.trim()) {
        return res.status(400).json({ error: "Rating and comment are required" });
      }
      const affectedRows = await ReviewModel.update({
        id: req.params.id,
        rating: Number(req.body.rating),
        comment: req.body.comment.trim(),
        user_id: userId
      });

      if (!affectedRows) {
        return res.status(404).json({ error: "Review not found" });
      }

      res.json({ success: true, message: "Review updated" });
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message || "Failed to update review" });
    }
  },
  async remove(req, res) {
    try {
      const userId = getUserIdFromRequest(req);
      const affectedRows = await ReviewModel.remove({ id: req.params.id, user_id: userId });
      if (!affectedRows) {
        return res.status(404).json({ error: "Review not found" });
      }
      res.json({ success: true, message: "Review deleted" });
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message || "Failed to delete review" });
    }
  },
  async getByProduct(req, res) {
    try {
      const reviews = await ReviewModel.getByProduct(req.params.product_id);
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  }
};

module.exports = reviewController;
