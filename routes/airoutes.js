const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/recommend-products', aiController.recommendProducts);
router.post('/recommend', aiController.recommend);
router.get('/complementary-options', aiController.getComplementaryOptions);

module.exports = router;
