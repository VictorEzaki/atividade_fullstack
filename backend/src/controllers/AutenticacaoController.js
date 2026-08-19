const AutenticacaoService = require('../services/AutenticacaoService');
const { responderSucesso } = require('../utils/resposta');

async function cadastrar(req, res, proximo) {
  try {
    const { nome, email, senha } = req.body;
    const { usuario, token } = await AutenticacaoService.cadastrar({ nome, email, senha });

    return responderSucesso(res, {
      dados: { usuario, token },
      mensagem: 'Cadastro realizado com sucesso.',
      status: 201
    });
  } catch (erro) {
    return proximo(erro);
  }
}

async function autenticar(req, res, proximo) {
  try {
    const { email, senha } = req.body;
    const { usuario, token } = await AutenticacaoService.autenticar({ email, senha });

    return responderSucesso(res, { dados: { usuario, token }, mensagem: 'Login realizado com sucesso.' });
  } catch (erro) {
    return proximo(erro);
  }
}

async function buscarPerfil(req, res, proximo) {
  try {
    const usuario = await AutenticacaoService.buscarUsuarioAutenticado(req.usuarioAutenticado.id);
    return responderSucesso(res, { dados: { usuario }, mensagem: 'Perfil carregado com sucesso.' });
  } catch (erro) {
    return proximo(erro);
  }
}

module.exports = { cadastrar, autenticar, buscarPerfil };
