const express = require('express');
const router = express.Router();
const topScorersController = require('../controllers/topScorersController');

router.get('/', topScorersController.getTopScorers);

module.exports = router;
