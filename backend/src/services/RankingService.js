const { Op } = require('sequelize');
const { Partida, Usuario, Tema, Dificuldade } = require('../models');

/**
 * Ranking pela melhor partida de cada jogador.
 * Criterio principal: maior pontuacao. Desempate: menor tempo total.
 */
async function listarRanking({ temaId, dificuldadeId, limite = 20 } = {}) {
  const filtros = { finalizadaEm: { [Op.ne]: null } };
  if (temaId) filtros.temaId = temaId;
  if (dificuldadeId) filtros.dificuldadeId = dificuldadeId;

  const partidas = await Partida.findAll({
    where: filtros,
    include: [
      { model: Usuario, as: 'usuario', attributes: ['id', 'nome'] },
      { model: Tema, as: 'tema', attributes: ['id', 'nome'] },
      { model: Dificuldade, as: 'dificuldade', attributes: ['id', 'nome'] }
    ],
    order: [
      ['pontuacao', 'DESC'],
      ['tempoTotal', 'ASC']
    ]
  });

  const melhorPorJogador = new Map();

  partidas.forEach((partida) => {
    if (!partida.usuario) return;
    if (!melhorPorJogador.has(partida.usuarioId)) {
      melhorPorJogador.set(partida.usuarioId, partida);
    }
  });

  const porPagina = Math.min(Math.max(Number(limite) || 20, 1), 100);

  return [...melhorPorJogador.values()]
    .sort((primeira, segunda) => {
      if (segunda.pontuacao !== primeira.pontuacao) {
        return segunda.pontuacao - primeira.pontuacao;
      }
      return (primeira.tempoTotal ?? Number.MAX_SAFE_INTEGER) - (segunda.tempoTotal ?? Number.MAX_SAFE_INTEGER);
    })
    .slice(0, porPagina)
    .map((partida, indice) => ({
      posicao: indice + 1,
      usuario: { id: partida.usuario.id, nome: partida.usuario.nome },
      tema: partida.tema,
      dificuldade: partida.dificuldade,
      pontuacao: partida.pontuacao,
      tempoTotal: partida.tempoTotal,
      finalizadaEm: partida.finalizadaEm
    }));
}

module.exports = { listarRanking };
