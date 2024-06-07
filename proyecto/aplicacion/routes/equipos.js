const express = require('express');
const router = express.Router();
const equiposController = require('../controllers/equipoController');

router.get('/', equiposController.getAllEquipos);
router.get('/:id', equiposController.getEquipoById);
router.post('/', equiposController.createEquipo);

module.exports = router;