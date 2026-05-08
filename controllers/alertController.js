const AlertModel = require('../models/alertModel');

const alertController = {
  async add(req, res) {
    try {
      const { product_id, type } = req.body;
      await AlertModel.add(product_id, type);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to add alert' });
    }
  },
  async getAll(req, res) {
    try {
      const alerts = await AlertModel.getAll();
      res.json(alerts);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch alerts' });
    }
  },
  async trigger(req, res) {
    try {
      await AlertModel.trigger(req.body.product_id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to trigger alert' });
    }
  },
  async clearAll(req, res) {
    try {
      await AlertModel.clearAll();
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to clear alerts' });
    }
  }
};

module.exports = alertController;
