const { responderErro } = require('../utils/resposta');

/**
 * Restringe a rota aos perfis informados.
 * Deve ser utilizado sempre apos o autenticacaoMiddleware.
 */
function permissaoMiddleware(...perfisPermitidos) {
  return (req, res, proximo) => {
    if (!req.usuarioAutenticado) {
      return responderErro(res, { mensagem: 'Autenticacao necessaria.', status: 401 });
    }

    if (!perfisPermitidos.includes(req.usuarioAutenticado.perfil)) {
      return responderErro(res, { mensagem: 'Voce nao tem permissao para esta operacao.', status: 403 });
    }

    return proximo();
  };
}

module.exports = permissaoMiddleware;
