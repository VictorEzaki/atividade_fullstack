const UsuarioService = require('../services/UsuarioService');
const { responderSucesso } = require('../utils/resposta');

async function listar(req, res, proximo) {
  try {
    const dados = await UsuarioService.listar(req.query);
    return responderSucesso(res, { dados, mensagem: 'Usuarios listados com sucesso.' });
  } catch (erro) {
    return proximo(erro);
  }
}

async function buscarPorId(req, res, proximo) {
  try {
    const usuario = await UsuarioService.buscarPorId(req.params.id);
    return responderSucesso(res, { dados: { usuario }, mensagem: 'Usuario encontrado.' });
  } catch (erro) {
    return proximo(erro);
  }
}

async function criar(req, res, proximo) {
  try {
    const usuario = await UsuarioService.criar(req.body);
    return responderSucesso(res, { dados: { usuario }, mensagem: 'Usuario criado com sucesso.', status: 201 });
  } catch (erro) {
    return proximo(erro);
  }
}

async function atualizar(req, res, proximo) {
  try {
    const usuario = await UsuarioService.atualizar(req.params.id, req.body);
    return responderSucesso(res, { dados: { usuario }, mensagem: 'Usuario atualizado com sucesso.' });
  } catch (erro) {
    return proximo(erro);
  }
}

async function excluir(req, res, proximo) {
  try {
    await UsuarioService.excluir(req.params.id, req.usuarioAutenticado.id);
    return responderSucesso(res, { mensagem: 'Usuario excluido com sucesso.' });
  } catch (erro) {
    return proximo(erro);
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
