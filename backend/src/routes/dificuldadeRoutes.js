const { Router } = require('express');
const DificuldadeController = require('../controllers/DificuldadeController');
const autenticacaoMiddleware = require('../middlewares/autenticacaoMiddleware');
const permissaoMiddleware = require('../middlewares/permissaoMiddleware');
const { PERFIS } = require('../utils/constantes');

const rotas = Router();
const somenteAdministrador = permissaoMiddleware(PERFIS.ADMINISTRADOR);

rotas.use(autenticacaoMiddleware);

rotas.get('/', DificuldadeController.listar);
rotas.get('/:id', somenteAdministrador, DificuldadeController.buscarPorId);
rotas.post('/', somenteAdministrador, DificuldadeController.criar);
rotas.put('/:id', somenteAdministrador, DificuldadeController.atualizar);
rotas.delete('/:id', somenteAdministrador, DificuldadeController.excluir);

module.exports = rotas;
