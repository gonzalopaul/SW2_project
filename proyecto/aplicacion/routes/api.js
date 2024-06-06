const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.get('/players', apiController.getAllPlayers);

module.exports = router;