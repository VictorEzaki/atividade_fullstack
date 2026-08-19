const { Op } = require('sequelize');
const { Usuario } = require('../models');
const ErroAplicacao = require('../utils/ErroAplicacao');
const { PERFIS } = require('../utils/constantes');

async function listar({ busca, perfil, pagina = 1, limite = 20 } = {}) {
  const filtros = {};

  if (busca) {
    filtros[Op.or] = [
      { nome: { [Op.like]: `%${busca}%` } },
      { email: { [Op.like]: `%${busca}%` } }
    ];
  }
  if (perfil) {
    filtros.perfil = perfil;
  }

  const paginaAtual = Math.max(Number(pagina) || 1, 1);
  const porPagina = Math.min(Math.max(Number(limite) || 20, 1), 100);

  const { rows, count } = await Usuario.findAndCountAll({
    where: filtros,
    order: [['nome', 'ASC']],
    offset: (paginaAtual - 1) * porPagina,
    limit: porPagina
  });

  return { usuarios: rows, total: count, pagina: paginaAtual, limite: porPagina };
}

async function buscarPorId(id) {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) {
    throw new ErroAplicacao('Usuario nao encontrado.', 404);
  }
  return usuario;
}

async function criar({ nome, email, senha, perfil }) {
  if (!nome || !email || !senha) {
    throw new ErroAplicacao('Informe nome, e-mail e senha.', 422);
  }
  if (perfil && !Object.values(PERFIS).includes(perfil)) {
    throw new ErroAplicacao('Perfil invalido.', 422);
  }

  const emailNormalizado = String(email).trim().toLowerCase();
  const jaCadastrado = await Usuario.findOne({ where: { email: emailNormalizado } });
  if (jaCadastrado) {
    throw new ErroAplicacao('Este e-mail ja esta cadastrado.', 409);
  }

  return Usuario.create({
    nome: String(nome).trim(),
    email: emailNormalizado,
    senha,
    perfil: perfil || PERFIS.JOGADOR
  });
}

async function atualizar(id, { nome, email, senha, perfil }) {
  const usuario = await buscarPorId(id);

  if (email && String(email).trim().toLowerCase() !== usuario.email) {
    const emailNormalizado = String(email).trim().toLowerCase();
    const emUso = await Usuario.findOne({ where: { email: emailNormalizado, id: { [Op.ne]: usuario.id } } });
    if (emUso) {
      throw new ErroAplicacao('Este e-mail ja esta cadastrado.', 409);
    }
    usuario.email = emailNormalizado;
  }

  if (nome) usuario.nome = String(nome).trim();
  if (senha) {
    if (String(senha).length < 6) {
      throw new ErroAplicacao('A senha deve possuir ao menos 6 caracteres.', 422);
    }
    usuario.senha = senha;
  }
  if (perfil) {
    if (!Object.values(PERFIS).includes(perfil)) {
      throw new ErroAplicacao('Perfil invalido.', 422);
    }
    usuario.perfil = perfil;
  }

  await usuario.save();
  return usuario;
}

async function excluir(id, usuarioSolicitanteId) {
  const usuario = await buscarPorId(id);

  if (Number(id) === Number(usuarioSolicitanteId)) {
    throw new ErroAplicacao('Nao e possivel excluir o proprio usuario.', 409);
  }

  if (usuario.perfil === PERFIS.ADMINISTRADOR) {
    const totalAdministradores = await Usuario.count({ where: { perfil: PERFIS.ADMINISTRADOR } });
    if (totalAdministradores <= 1) {
      throw new ErroAplicacao('O sistema deve possuir ao menos um administrador.', 409);
    }
  }

  await usuario.destroy();
  return true;
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
