const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/', reviewController.add);
router.put('/:id', reviewController.update);
router.delete('/:id', reviewController.remove);
router.get('/:product_id', reviewController.getByProduct);

module.exports = router;
