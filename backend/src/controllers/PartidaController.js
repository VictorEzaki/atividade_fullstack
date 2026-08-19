const JogoService = require('../services/JogoService');
const { responderSucesso } = require('../utils/resposta');

async function iniciarPartida(req, res, proximo) {
  try {
    const dados = await JogoService.iniciarPartida(req.usuarioAutenticado.id, req.body);
    return responderSucesso(res, { dados, mensagem: 'Partida iniciada com sucesso.', status: 201 });
  } catch (erro) {
    return proximo(erro);
  }
}

async function buscarEstado(req, res, proximo) {
  try {
    const dados = await JogoService.obterEstadoDaPartida(req.params.id, req.usuarioAutenticado.id);
    return responderSucesso(res, { dados, mensagem: 'Estado da partida carregado.' });
  } catch (erro) {
    return proximo(erro);
  }
}

async function responderRequisito(req, res, proximo) {
  try {
    const dados = await JogoService.responderRequisito(req.usuarioAutenticado.id, req.params.id, req.body);
    return responderSucesso(res, { dados, mensagem: 'Resposta registrada.' });
  } catch (erro) {
    return proximo(erro);
  }
}

async function finalizarPartida(req, res, proximo) {
  try {
    const dados = await JogoService.finalizarPartida(req.params.id, req.usuarioAutenticado.id);
    return responderSucesso(res, { dados, mensagem: 'Partida finalizada.' });
  } catch (erro) {
    return proximo(erro);
  }
}

async function buscarResultado(req, res, proximo) {
  try {
    const dados = await JogoService.buscarResultado(req.params.id, req.usuarioAutenticado.id);
    return responderSucesso(res, { dados, mensagem: 'Resultado carregado.' });
  } catch (erro) {
    return proximo(erro);
  }
}

module.exports = { iniciarPartida, buscarEstado, responderRequisito, finalizarPartida, buscarResultado };
