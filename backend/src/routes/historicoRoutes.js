const { Router } = require('express');
const HistoricoController = require('../controllers/HistoricoController');
const autenticacaoMiddleware = require('../middlewares/autenticacaoMiddleware');

const rotas = Router();

rotas.use(autenticacaoMiddleware);

rotas.get('/', HistoricoController.buscarHistorico);
rotas.get('/resumo', HistoricoController.buscarResumo);
rotas.get('/:partidaId', HistoricoController.buscarDetalhesDaPartida);

module.exports = rotas;
