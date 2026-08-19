const { Router } = require('express');
const AutenticacaoController = require('../controllers/AutenticacaoController');
const autenticacaoMiddleware = require('../middlewares/autenticacaoMiddleware');

const rotas = Router();

rotas.post('/cadastro', AutenticacaoController.cadastrar);
rotas.post('/login', AutenticacaoController.autenticar);
rotas.get('/perfil', autenticacaoMiddleware, AutenticacaoController.buscarPerfil);

module.exports = rotas;
