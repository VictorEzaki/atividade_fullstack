const jwt = require('jsonwebtoken');
const configuracao = require('../config');
const { responderErro } = require('../utils/resposta');

function autenticacaoMiddleware(req, res, proximo) {
  const cabecalho = req.headers.authorization;

  if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
    return responderErro(res, { mensagem: 'Autenticacao necessaria.', status: 401 });
  }

  const token = cabecalho.replace('Bearer ', '').trim();

  try {
    const conteudo = jwt.verify(token, configuracao.jwt.segredo);
    req.usuarioAutenticado = { id: conteudo.id, perfil: conteudo.perfil };
    return proximo();
  } catch (erro) {
    return responderErro(res, { mensagem: 'Sessao invalida ou expirada.', status: 401 });
  }
}

module.exports = autenticacaoMiddleware;
