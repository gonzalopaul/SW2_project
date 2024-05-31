// routes/equipos.js
const express = require('express');
const router = express.Router();
const equipoController = require('../controllers/equipoController');

router.get('/', equipoController.getAllEquipos);
router.post('/', equipoController.createEquipo);
router.get('/:id', equipoController.getEquipoById);

module.exports = router;

