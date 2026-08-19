const RankingService = require('../services/RankingService');
const { responderSucesso } = require('../utils/resposta');

async function listarRanking(req, res, proximo) {
  try {
    const ranking = await RankingService.listarRanking(req.query);
    return responderSucesso(res, { dados: { ranking }, mensagem: 'Ranking carregado com sucesso.' });
  } catch (erro) {
    return proximo(erro);
  }
}

module.exports = { listarRanking };
