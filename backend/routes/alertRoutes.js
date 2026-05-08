const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

router.post('/', alertController.add);
router.get('/', alertController.getAll);
router.delete('/', alertController.clearAll);

module.exports = router;
