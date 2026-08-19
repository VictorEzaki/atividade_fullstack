const { Router } = require('express');
const PainelController = require('../controllers/PainelController');
const autenticacaoMiddleware = require('../middlewares/autenticacaoMiddleware');
const permissaoMiddleware = require('../middlewares/permissaoMiddleware');
const { PERFIS } = require('../utils/constantes');

const rotas = Router();

rotas.use(autenticacaoMiddleware, permissaoMiddleware(PERFIS.ADMINISTRADOR));
rotas.get('/indicadores', PainelController.buscarIndicadores);

module.exports = rotas;
