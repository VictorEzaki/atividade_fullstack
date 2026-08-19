const { Op } = require('sequelize');
const { sequelize, Tema, Requisito, Partida } = require('../models');
const ErroAplicacao = require('../utils/ErroAplicacao');

function montarFiltros({ busca, ativo }) {
  const filtros = {};
  if (busca) {
    filtros[Op.or] = [
      { nome: { [Op.like]: `%${busca}%` } },
      { descricao: { [Op.like]: `%${busca}%` } }
    ];
  }
  if (ativo !== undefined && ativo !== null && ativo !== '') {
    filtros.ativo = ativo === true || ativo === 'true';
  }
  return filtros;
}

async function listar({ busca, ativo, comRequisitos = false } = {}) {
  return Tema.findAll({
    where: montarFiltros({ busca, ativo }),
    order: [['nome', 'ASC']],
    include: comRequisitos
      ? [{ model: Requisito, as: 'requisitos', through: { attributes: [] } }]
      : []
  });
}

async function buscarPorId(id, { comRequisitos = true } = {}) {
  const tema = await Tema.findByPk(id, {
    include: comRequisitos
      ? [{ model: Requisito, as: 'requisitos', through: { attributes: [] } }]
      : []
  });
  if (!tema) {
    throw new ErroAplicacao('Tema nao encontrado.', 404);
  }
  return tema;
}

async function criar({ nome, descricao, ativo = true, requisitosIds = [] }) {
  if (!nome) {
    throw new ErroAplicacao('Informe o nome do tema.', 422);
  }

  const jaExiste = await Tema.findOne({ where: { nome: String(nome).trim() } });
  if (jaExiste) {
    throw new ErroAplicacao('Ja existe um tema com este nome.', 409);
  }

  return sequelize.transaction(async (transacao) => {
    const tema = await Tema.create(
      { nome: String(nome).trim(), descricao: descricao || null, ativo: ativo !== false },
      { transaction: transacao }
    );

    if (requisitosIds.length > 0) {
      await tema.setRequisitos(requisitosIds, { transaction: transacao });
    }

    return tema;
  });
}

async function atualizar(id, { nome, descricao, ativo, requisitosIds }) {
  const tema = await buscarPorId(id, { comRequisitos: false });

  if (nome && String(nome).trim() !== tema.nome) {
    const emUso = await Tema.findOne({ where: { nome: String(nome).trim(), id: { [Op.ne]: tema.id } } });
    if (emUso) {
      throw new ErroAplicacao('Ja existe um tema com este nome.', 409);
    }
  }

  return sequelize.transaction(async (transacao) => {
    if (nome !== undefined) tema.nome = String(nome).trim();
    if (descricao !== undefined) tema.descricao = descricao;
    if (ativo !== undefined) tema.ativo = ativo === true || ativo === 'true';

    await tema.save({ transaction: transacao });

    if (Array.isArray(requisitosIds)) {
      await tema.setRequisitos(requisitosIds, { transaction: transacao });
    }

    return tema;
  });
}

async function excluir(id) {
  const tema = await buscarPorId(id, { comRequisitos: false });

  const partidasVinculadas = await Partida.count({ where: { temaId: tema.id } });
  if (partidasVinculadas > 0) {
    throw new ErroAplicacao('Nao e possivel excluir um tema que ja possui partidas. Desative-o.', 409);
  }

  return sequelize.transaction(async (transacao) => {
    await tema.setRequisitos([], { transaction: transacao });
    await tema.destroy({ transaction: transacao });
    return true;
  });
}

async function alterarSituacao(id, ativo) {
  const tema = await buscarPorId(id, { comRequisitos: false });
  tema.ativo = ativo === true || ativo === 'true';
  await tema.save();
  return tema;
}

async function associarRequisitos(id, requisitosIds = []) {
  const tema = await buscarPorId(id, { comRequisitos: false });

  const requisitos = await Requisito.findAll({ where: { id: requisitosIds } });
  if (requisitos.length !== requisitosIds.length) {
    throw new ErroAplicacao('Um ou mais requisitos informados nao existem.', 422);
  }

  return sequelize.transaction(async (transacao) => {
    await tema.addRequisitos(requisitosIds, { transaction: transacao });
    return buscarPorId(id);
  });
}

async function removerAssociacao(id, requisitoId) {
  const tema = await buscarPorId(id, { comRequisitos: false });
  await tema.removeRequisito(requisitoId);
  return buscarPorId(id);
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  excluir,
  alterarSituacao,
  associarRequisitos,
  removerAssociacao
};
