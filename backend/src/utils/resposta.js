function responderSucesso(res, { dados = null, mensagem = 'Operacao realizada com sucesso.', status = 200 } = {}) {
  return res.status(status).json({ sucesso: true, dados, mensagem });
}

function responderErro(res, { mensagem = 'Nao foi possivel realizar a operacao.', status = 400 } = {}) {
  return res.status(status).json({ sucesso: false, mensagem });
}

module.exports = { responderSucesso, responderErro };
