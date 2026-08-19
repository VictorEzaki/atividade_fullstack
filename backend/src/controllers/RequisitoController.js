const RequisitoService = require('../services/RequisitoService');
const { responderSucesso } = require('../utils/resposta');

async function listar(req, res, proximo) {
  try {
    const dados = await RequisitoService.listar(req.query);
    return responderSucesso(res, { dados, mensagem: 'Requisitos listados com sucesso.' });
  } catch (erro) {
    return proximo(erro);
  }
}

async function buscarPorId(req, res, proximo) {
  try {
    const requisito = await RequisitoService.buscarPorId(req.params.id);
    return responderSucesso(res, { dados: { requisito }, mensagem: 'Requisito encontrado.' });
  } catch (erro) {
    return proximo(erro);
  }
}

async function criar(req, res, proximo) {
  try {
    const requisito = await RequisitoService.criar(req.body);
    return responderSucesso(res, { dados: { requisito }, mensagem: 'Requisito criado com sucesso.', status: 201 });
  } catch (erro) {
    return proximo(erro);
  }
}

async function atualizar(req, res, proximo) {
  try {
    const requisito = await RequisitoService.atualizar(req.params.id, req.body);
    return responderSucesso(res, { dados: { requisito }, mensagem: 'Requisito atualizado com sucesso.' });
  } catch (erro) {
    return proximo(erro);
  }
}

async function excluir(req, res, proximo) {
  try {
    await RequisitoService.excluir(req.params.id);
    return responderSucesso(res, { mensagem: 'Requisito excluido com sucesso.' });
  } catch (erro) {
    return proximo(erro);
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
