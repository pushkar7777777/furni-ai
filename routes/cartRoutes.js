const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/add', cartController.add);
router.get('/', cartController.getAll);
router.put('/update', cartController.update);
router.delete('/:id', cartController.remove);

module.exports = router;
