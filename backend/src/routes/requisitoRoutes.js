const { Router } = require('express');
const RequisitoController = require('../controllers/RequisitoController');
const autenticacaoMiddleware = require('../middlewares/autenticacaoMiddleware');
const permissaoMiddleware = require('../middlewares/permissaoMiddleware');
const { PERFIS } = require('../utils/constantes');

const rotas = Router();

rotas.use(autenticacaoMiddleware, permissaoMiddleware(PERFIS.ADMINISTRADOR));

rotas.get('/', RequisitoController.listar);
rotas.get('/:id', RequisitoController.buscarPorId);
rotas.post('/', RequisitoController.criar);
rotas.put('/:id', RequisitoController.atualizar);
rotas.delete('/:id', RequisitoController.excluir);

module.exports = rotas;
