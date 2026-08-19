const { Op } = require('sequelize');
const { sequelize, Requisito, Tema, RespostaPartida } = require('../models');
const ErroAplicacao = require('../utils/ErroAplicacao');
const { TIPOS_REQUISITO } = require('../utils/constantes');

const inclusaoTemas = { model: Tema, as: 'temas', through: { attributes: [] } };

async function listar({ busca, tipo, temaId, pagina = 1, limite = 20 } = {}) {
  const filtros = {};
  if (busca) filtros.texto = { [Op.like]: `%${busca}%` };
  if (tipo) filtros.tipo = tipo;

  const paginaAtual = Math.max(Number(pagina) || 1, 1);
  const porPagina = Math.min(Math.max(Number(limite) || 20, 1), 100);

  const inclusao = temaId
    ? [{ ...inclusaoTemas, where: { id: temaId }, required: true }]
    : [inclusaoTemas];

  const { rows, count } = await Requisito.findAndCountAll({
    where: filtros,
    include: inclusao,
    order: [['id', 'DESC']],
    offset: (paginaAtual - 1) * porPagina,
    limit: porPagina,
    distinct: true
  });

  return { requisitos: rows, total: count, pagina: paginaAtual, limite: porPagina };
}

async function buscarPorId(id) {
  const requisito = await Requisito.findByPk(id, { include: [inclusaoTemas] });
  if (!requisito) {
    throw new ErroAplicacao('Requisito nao encontrado.', 404);
  }
  return requisito;
}

function validarTipo(tipo) {
  if (!Object.values(TIPOS_REQUISITO).includes(tipo)) {
    throw new ErroAplicacao('Tipo de requisito invalido. Utilize RF, RNF ou RN.', 422);
  }
}

async function criar({ texto, tipo, temasIds = [] }) {
  if (!texto || !tipo) {
    throw new ErroAplicacao('Informe o texto e o tipo do requisito.', 422);
  }
  validarTipo(tipo);

  return sequelize.transaction(async (transacao) => {
    const requisito = await Requisito.create(
      { texto: String(texto).trim(), tipo },
      { transaction: transacao }
    );

    if (temasIds.length > 0) {
      await requisito.setTemas(temasIds, { transaction: transacao });
    }

    return requisito;
  }).then((requisito) => buscarPorId(requisito.id));
}

async function atualizar(id, { texto, tipo, temasIds }) {
  const requisito = await buscarPorId(id);

  if (tipo !== undefined) validarTipo(tipo);

  return sequelize.transaction(async (transacao) => {
    if (texto !== undefined) requisito.texto = String(texto).trim();
    if (tipo !== undefined) requisito.tipo = tipo;

    await requisito.save({ transaction: transacao });

    if (Array.isArray(temasIds)) {
      await requisito.setTemas(temasIds, { transaction: transacao });
    }

    return requisito;
  }).then(() => buscarPorId(id));
}

async function excluir(id) {
  const requisito = await buscarPorId(id);

  const respostasVinculadas = await RespostaPartida.count({ where: { requisitoId: requisito.id } });
  if (respostasVinculadas > 0) {
    throw new ErroAplicacao('Nao e possivel excluir um requisito ja utilizado em partidas.', 409);
  }

  return sequelize.transaction(async (transacao) => {
    await requisito.setTemas([], { transaction: transacao });
    await requisito.destroy({ transaction: transacao });
    return true;
  });
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
