const PainelService = require('../services/PainelService');
const { responderSucesso } = require('../utils/resposta');

async function buscarIndicadores(req, res, proximo) {
  try {
    const indicadores = await PainelService.buscarIndicadores();
    return responderSucesso(res, { dados: { indicadores }, mensagem: 'Indicadores carregados com sucesso.' });
  } catch (erro) {
    return proximo(erro);
  }
}

module.exports = { buscarIndicadores };
