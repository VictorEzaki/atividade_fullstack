const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const configuracao = require('../config');
const ErroAplicacao = require('../utils/ErroAplicacao');
const { PERFIS } = require('../utils/constantes');

function gerarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, perfil: usuario.perfil },
    configuracao.jwt.segredo,
    { expiresIn: configuracao.jwt.expiracao }
  );
}

async function cadastrar({ nome, email, senha }) {
  if (!nome || !email || !senha) {
    throw new ErroAplicacao('Informe nome, e-mail e senha.', 422);
  }
  if (String(senha).length < 6) {
    throw new ErroAplicacao('A senha deve possuir ao menos 6 caracteres.', 422);
  }

  const emailNormalizado = String(email).trim().toLowerCase();
  const jaCadastrado = await Usuario.findOne({ where: { email: emailNormalizado } });
  if (jaCadastrado) {
    throw new ErroAplicacao('Este e-mail ja esta cadastrado.', 409);
  }

  const usuario = await Usuario.create({
    nome: String(nome).trim(),
    email: emailNormalizado,
    senha,
    perfil: PERFIS.JOGADOR
  });

  return { usuario, token: gerarToken(usuario) };
}

async function autenticar({ email, senha }) {
  if (!email || !senha) {
    throw new ErroAplicacao('Informe e-mail e senha.', 422);
  }

  const usuario = await Usuario.findOne({ where: { email: String(email).trim().toLowerCase() } });
  if (!usuario) {
    throw new ErroAplicacao('E-mail ou senha invalidos.', 401);
  }

  const senhaConfere = await usuario.verificarSenha(String(senha));
  if (!senhaConfere) {
    throw new ErroAplicacao('E-mail ou senha invalidos.', 401);
  }

  return { usuario, token: gerarToken(usuario) };
}

async function buscarUsuarioAutenticado(usuarioId) {
  const usuario = await Usuario.findByPk(usuarioId);
  if (!usuario) {
    throw new ErroAplicacao('Usuario nao encontrado.', 404);
  }
  return usuario;
}

module.exports = { cadastrar, autenticar, buscarUsuarioAutenticado, gerarToken };
