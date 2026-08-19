const { Router } = require('express');
const RankingController = require('../controllers/RankingController');
const autenticacaoMiddleware = require('../middlewares/autenticacaoMiddleware');

const rotas = Router();

rotas.use(autenticacaoMiddleware);
rotas.get('/', RankingController.listarRanking);

module.exports = rotas;
