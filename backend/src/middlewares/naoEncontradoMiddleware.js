const { responderErro } = require('../utils/resposta');

function naoEncontradoMiddleware(req, res) {
  return responderErro(res, { mensagem: 'Recurso nao encontrado.', status: 404 });
}

module.exports = naoEncontradoMiddleware;
