const { Op } = require('sequelize');
const { Partida, Tema, Dificuldade, RespostaPartida } = require('../models');
const ErroAplicacao = require('../utils/ErroAplicacao');
const { montarResultado } = require('./JogoService');

async function buscarHistorico(usuarioId, { temaId, dificuldadeId, pagina = 1, limite = 10 } = {}) {
  const filtros = { usuarioId, finalizadaEm: { [Op.ne]: null } };
  if (temaId) filtros.temaId = temaId;
  if (dificuldadeId) filtros.dificuldadeId = dificuldadeId;

  const paginaAtual = Math.max(Number(pagina) || 1, 1);
  const porPagina = Math.min(Math.max(Number(limite) || 10, 1), 50);

  const { rows, count } = await Partida.findAndCountAll({
    where: filtros,
    include: [
      { model: Tema, as: 'tema', attributes: ['id', 'nome'] },
      { model: Dificuldade, as: 'dificuldade', attributes: ['id', 'nome', 'pontos'] }
    ],
    order: [['finalizadaEm', 'DESC']],
    offset: (paginaAtual - 1) * porPagina,
    limit: porPagina
  });

  const partidas = await Promise.all(
    rows.map(async (partida) => {
      const acertos = await RespostaPartida.count({ where: { partidaId: partida.id, correta: true } });
      return {
        id: partida.id,
        tema: partida.tema,
        dificuldade: partida.dificuldade,
        pontuacao: partida.pontuacao,
        tempoTotal: partida.tempoTotal,
        acertos,
        iniciadaEm: partida.iniciadaEm,
        finalizadaEm: partida.finalizadaEm
      };
    })
  );

  return { partidas, total: count, pagina: paginaAtual, limite: porPagina };
}

async function buscarDetalhesDaPartida(usuarioId, partidaId) {
  const partida = await Partida.findByPk(partidaId, {
    include: [
      { model: Tema, as: 'tema' },
      { model: Dificuldade, as: 'dificuldade' }
    ]
  });

  if (!partida) {
    throw new ErroAplicacao('Partida nao encontrada.', 404);
  }
  if (partida.usuarioId !== Number(usuarioId)) {
    throw new ErroAplicacao('Esta partida nao pertence ao usuario autenticado.', 403);
  }
  if (!partida.finalizadaEm) {
    throw new ErroAplicacao('Esta partida ainda esta em andamento.', 409);
  }

  return montarResultado(partida);
}

async function buscarResumo(usuarioId) {
  const partidas = await Partida.findAll({
    where: { usuarioId, finalizadaEm: { [Op.ne]: null } },
    attributes: ['id', 'pontuacao']
  });

  const totalPartidas = partidas.length;
  const melhorPontuacao = partidas.reduce((maior, partida) => Math.max(maior, partida.pontuacao), 0);
  const pontuacaoTotal = partidas.reduce((soma, partida) => soma + partida.pontuacao, 0);

  const idsPartidas = partidas.map((partida) => partida.id);
  const totalRespostas = await RespostaPartida.count({
    where: { partidaId: idsPartidas, respondidaEm: { [Op.ne]: null } }
  });
  const totalAcertos = await RespostaPartida.count({
    where: { partidaId: idsPartidas, correta: true }
  });

  return {
    totalPartidas,
    melhorPontuacao,
    pontuacaoTotal,
    aproveitamento: totalRespostas > 0 ? Math.round((totalAcertos / totalRespostas) * 100) : 0
  };
}

module.exports = { buscarHistorico, buscarDetalhesDaPartida, buscarResumo };
