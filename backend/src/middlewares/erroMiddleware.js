const configuracao = require('../config');
const { responderErro } = require('../utils/resposta');

const MENSAGENS_SEQUELIZE = {
  SequelizeUniqueConstraintError: { mensagem: 'Ja existe um registro com estes dados.', status: 409 },
  SequelizeValidationError: { mensagem: 'Dados invalidos. Verifique os campos informados.', status: 422 },
  SequelizeForeignKeyConstraintError: { mensagem: 'Existem registros vinculados a este item.', status: 409 }
};

// eslint-disable-next-line no-unused-vars
function erroMiddleware(erro, req, res, proximo) {
  if (erro.previsto) {
    return responderErro(res, { mensagem: erro.message, status: erro.status });
  }

  const tratamentoSequelize = MENSAGENS_SEQUELIZE[erro.name];
  if (tratamentoSequelize) {
    return responderErro(res, tratamentoSequelize);
  }

  if (configuracao.ambiente !== 'production') {
    console.error(erro);
  }

  return responderErro(res, { mensagem: 'Erro interno do servidor.', status: 500 });
}

module.exports = erroMiddleware;
