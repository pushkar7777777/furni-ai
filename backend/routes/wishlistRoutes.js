const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

router.post('/', wishlistController.add);
router.get('/', wishlistController.getAll);
router.delete('/:id', wishlistController.remove);

module.exports = router;
