const ProductModel = require('../models/productModel');
const ReviewModel = require('../models/reviewModel');

const productController = {
  async getAll(req, res) {
    try {
      const filters = req.query;
      const products = await ProductModel.getAll(filters);
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  },
  async getById(req, res) {
    try {
      const product = await ProductModel.getById(req.params.id);
      if (!product) return res.status(404).json({ error: 'Not found' });
      const reviews = await ReviewModel.getByProduct(req.params.id);
      const avgRating = await ReviewModel.getAverageRating(req.params.id);
      res.json({ ...product, reviews, avgRating });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  }
};

module.exports = productController;
