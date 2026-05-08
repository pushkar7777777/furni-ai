const express = require("express");
const router = express.Router();
const receiptController = require("../controllers/receiptController");

router.get("/:orderId", receiptController.getReceipt);

module.exports = router;
