const { Router } = require('express');
const TemaController = require('../controllers/TemaController');
const autenticacaoMiddleware = require('../middlewares/autenticacaoMiddleware');
const permissaoMiddleware = require('../middlewares/permissaoMiddleware');
const { PERFIS } = require('../utils/constantes');

const rotas = Router();
const somenteAdministrador = permissaoMiddleware(PERFIS.ADMINISTRADOR);

rotas.use(autenticacaoMiddleware);

rotas.get('/disponiveis', TemaController.listarDisponiveis);
rotas.get('/', somenteAdministrador, TemaController.listar);
rotas.get('/:id', somenteAdministrador, TemaController.buscarPorId);
rotas.post('/', somenteAdministrador, TemaController.criar);
rotas.put('/:id', somenteAdministrador, TemaController.atualizar);
rotas.patch('/:id/situacao', somenteAdministrador, TemaController.alterarSituacao);
rotas.delete('/:id', somenteAdministrador, TemaController.excluir);
rotas.post('/:id/requisitos', somenteAdministrador, TemaController.associarRequisitos);
rotas.delete('/:id/requisitos/:requisitoId', somenteAdministrador, TemaController.removerAssociacao);

module.exports = rotas;
