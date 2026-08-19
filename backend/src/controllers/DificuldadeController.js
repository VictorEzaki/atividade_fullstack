const DificuldadeService = require('../services/DificuldadeService');
const { responderSucesso } = require('../utils/resposta');

async function listar(req, res, proximo) {
  try {
    const dificuldades = await DificuldadeService.listar({ apenasAtivas: req.query.apenasAtivas === 'true' });
    return responderSucesso(res, { dados: { dificuldades }, mensagem: 'Dificuldades listadas com sucesso.' });
  } catch (erro) {
    return proximo(erro);
  }
}

async function buscarPorId(req, res, proximo) {
  try {
    const dificuldade = await DificuldadeService.buscarPorId(req.params.id);
    return responderSucesso(res, { dados: { dificuldade }, mensagem: 'Dificuldade encontrada.' });
  } catch (erro) {
    return proximo(erro);
  }
}

async function criar(req, res, proximo) {
  try {
    const dificuldade = await DificuldadeService.criar(req.body);
    return responderSucesso(res, {
      dados: { dificuldade },
      mensagem: 'Dificuldade criada com sucesso.',
      status: 201
    });
  } catch (erro) {
    return proximo(erro);
  }
}

async function atualizar(req, res, proximo) {
  try {
    const dificuldade = await DificuldadeService.atualizar(req.params.id, req.body);
    return responderSucesso(res, { dados: { dificuldade }, mensagem: 'Dificuldade atualizada com sucesso.' });
  } catch (erro) {
    return proximo(erro);
  }
}

async function excluir(req, res, proximo) {
  try {
    await DificuldadeService.excluir(req.params.id);
    return responderSucesso(res, { mensagem: 'Dificuldade excluida com sucesso.' });
  } catch (erro) {
    return proximo(erro);
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
