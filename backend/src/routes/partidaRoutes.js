const { Router } = require('express');
const PartidaController = require('../controllers/PartidaController');
const autenticacaoMiddleware = require('../middlewares/autenticacaoMiddleware');

const rotas = Router();

rotas.use(autenticacaoMiddleware);

rotas.post('/', PartidaController.iniciarPartida);
rotas.get('/:id', PartidaController.buscarEstado);
rotas.post('/:id/respostas', PartidaController.responderRequisito);
rotas.post('/:id/finalizacao', PartidaController.finalizarPartida);
rotas.get('/:id/resultado', PartidaController.buscarResultado);

module.exports = rotas;
