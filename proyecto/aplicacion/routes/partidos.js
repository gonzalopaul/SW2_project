const express = require('express');
const router = express.Router();
const partidoController = require('../controllers/partidoController');

router.get('/', partidoController.getAllPartidos);
router.get('/:id', partidoController.getPartidoById);
router.post('/', partidoController.createPartido);
router.get('/:id/resultado', partidoController.getResultadoByPartidoId);
router.put('/:id/resultado', partidoController.updateResultadoByPartidoId);

module.exports = router;
