const HistoricoService = require('../services/HistoricoService');
const { responderSucesso } = require('../utils/resposta');

async function buscarHistorico(req, res, proximo) {
  try {
    const dados = await HistoricoService.buscarHistorico(req.usuarioAutenticado.id, req.query);
    return responderSucesso(res, { dados, mensagem: 'Historico carregado com sucesso.' });
  } catch (erro) {
    return proximo(erro);
  }
}

async function buscarResumo(req, res, proximo) {
  try {
    const resumo = await HistoricoService.buscarResumo(req.usuarioAutenticado.id);
    return responderSucesso(res, { dados: { resumo }, mensagem: 'Resumo carregado com sucesso.' });
  } catch (erro) {
    return proximo(erro);
  }
}

async function buscarDetalhesDaPartida(req, res, proximo) {
  try {
    const dados = await HistoricoService.buscarDetalhesDaPartida(req.usuarioAutenticado.id, req.params.partidaId);
    return responderSucesso(res, { dados, mensagem: 'Detalhes da partida carregados.' });
  } catch (erro) {
    return proximo(erro);
  }
}

module.exports = { buscarHistorico, buscarResumo, buscarDetalhesDaPartida };
