const { Router } = require('express');
const UsuarioController = require('../controllers/UsuarioController');
const autenticacaoMiddleware = require('../middlewares/autenticacaoMiddleware');
const permissaoMiddleware = require('../middlewares/permissaoMiddleware');
const { PERFIS } = require('../utils/constantes');

const rotas = Router();

rotas.use(autenticacaoMiddleware, permissaoMiddleware(PERFIS.ADMINISTRADOR));

rotas.get('/', UsuarioController.listar);
rotas.get('/:id', UsuarioController.buscarPorId);
rotas.post('/', UsuarioController.criar);
rotas.put('/:id', UsuarioController.atualizar);
rotas.delete('/:id', UsuarioController.excluir);

module.exports = rotas;
