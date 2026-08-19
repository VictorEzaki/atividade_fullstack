const TemaService = require('../services/TemaService');
const { responderSucesso } = require('../utils/resposta');

async function listar(req, res, proximo) {
  try {
    const temas = await TemaService.listar({
      busca: req.query.busca,
      ativo: req.query.ativo,
      comRequisitos: req.query.comRequisitos === 'true'
    });
    return responderSucesso(res, { dados: { temas }, mensagem: 'Temas listados com sucesso.' });
  } catch (erro) {
    return proximo(erro);
  }
}

async function listarDisponiveis(req, res, proximo) {
  try {
    const temas = await TemaService.listar({ ativo: 'true' });
    return responderSucesso(res, { dados: { temas }, mensagem: 'Temas disponiveis listados com sucesso.' });
  } catch (erro) {
    return proximo(erro);
  }
}

async function buscarPorId(req, res, proximo) {
  try {
    const tema = await TemaService.buscarPorId(req.params.id);
    return responderSucesso(res, { dados: { tema }, mensagem: 'Tema encontrado.' });
  } catch (erro) {
    return proximo(erro);
  }
}

async function criar(req, res, proximo) {
  try {
    const tema = await TemaService.criar(req.body);
    return responderSucesso(res, { dados: { tema }, mensagem: 'Tema criado com sucesso.', status: 201 });
  } catch (erro) {
    return proximo(erro);
  }
}

async function atualizar(req, res, proximo) {
  try {
    const tema = await TemaService.atualizar(req.params.id, req.body);
    return responderSucesso(res, { dados: { tema }, mensagem: 'Tema atualizado com sucesso.' });
  } catch (erro) {
    return proximo(erro);
  }
}

async function alterarSituacao(req, res, proximo) {
  try {
    const tema = await TemaService.alterarSituacao(req.params.id, req.body.ativo);
    return responderSucesso(res, { dados: { tema }, mensagem: 'Situacao do tema atualizada.' });
  } catch (erro) {
    return proximo(erro);
  }
}

async function excluir(req, res, proximo) {
  try {
    await TemaService.excluir(req.params.id);
    return responderSucesso(res, { mensagem: 'Tema excluido com sucesso.' });
  } catch (erro) {
    return proximo(erro);
  }
}

async function associarRequisitos(req, res, proximo) {
  try {
    const tema = await TemaService.associarRequisitos(req.params.id, req.body.requisitosIds || []);
    return responderSucesso(res, { dados: { tema }, mensagem: 'Requisitos associados com sucesso.' });
  } catch (erro) {
    return proximo(erro);
  }
}

async function removerAssociacao(req, res, proximo) {
  try {
    const tema = await TemaService.removerAssociacao(req.params.id, req.params.requisitoId);
    return responderSucesso(res, { dados: { tema }, mensagem: 'Associacao removida com sucesso.' });
  } catch (erro) {
    return proximo(erro);
  }
}

module.exports = {
  listar,
  listarDisponiveis,
  buscarPorId,
  criar,
  atualizar,
  alterarSituacao,
  excluir,
  associarRequisitos,
  removerAssociacao
};
