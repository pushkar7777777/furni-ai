const ReceiptModel = require("../models/receiptModel");

const receiptController = {
  async getReceipt(req, res) {
    try {
      const { orderId } = req.params;
      const receipt = await ReceiptModel.ensureReceipt(orderId);
      
      if (!receipt) {
        return res.status(404).json({ error: "Receipt not found" });
      }

      res.json(receipt);
    } catch (error) {
      console.error("Error fetching receipt:", error);
      res.status(500).json({ error: "Failed to fetch receipt" });
    }
  }
};

module.exports = receiptController;
