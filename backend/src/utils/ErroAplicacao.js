/**
 * Erro previsto pelas regras de negocio.
 * Permite que o erroMiddleware devolva o status HTTP adequado
 * sem expor detalhes internos da aplicacao.
 */
class ErroAplicacao extends Error {
  constructor(mensagem, status = 400) {
    super(mensagem);
    this.name = 'ErroAplicacao';
    this.status = status;
    this.previsto = true;
  }
}

module.exports = ErroAplicacao;
