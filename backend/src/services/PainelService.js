const { Op, fn, col, literal } = require('sequelize');
const {
  Partida,
  RespostaPartida,
  Requisito,
  Tema,
  Usuario,
  Dificuldade
} = require('../models');
const { PERFIS } = require('../utils/constantes');

async function contarTotais() {
  const [usuarios, jogadores, temas, requisitos, dificuldades, partidas] = await Promise.all([
    Usuario.count(),
    Usuario.count({ where: { perfil: PERFIS.JOGADOR } }),
    Tema.count(),
    Requisito.count(),
    Dificuldade.count({ where: { ativo: true } }),
    Partida.count({ where: { finalizadaEm: { [Op.ne]: null } } })
  ]);

  return { usuarios, jogadores, temas, requisitos, dificuldades, partidas };
}

async function listarTemasMaisJogados(limite = 5) {
  const registros = await Partida.findAll({
    attributes: ['temaId', [fn('COUNT', col('Partida.id')), 'totalPartidas']],
    where: { finalizadaEm: { [Op.ne]: null } },
    include: [{ model: Tema, as: 'tema', attributes: ['id', 'nome'] }],
    group: ['Partida.temaId', 'tema.id', 'tema.nome'],
    order: [[literal('totalPartidas'), 'DESC']],
    limit: limite
  });

  return registros.map((registro) => ({
    tema: registro.tema ? registro.tema.nome : 'Tema removido',
    totalPartidas: Number(registro.get('totalPartidas'))
  }));
}

async function listarRequisitosComMaiorErro(limite = 5) {
  const registros = await RespostaPartida.findAll({
    attributes: [
      'requisitoId',
      [fn('COUNT', col('RespostaPartida.id')), 'totalRespostas'],
      [fn('SUM', literal('CASE WHEN correta = 1 THEN 0 ELSE 1 END')), 'totalErros']
    ],
    where: { respondidaEm: { [Op.ne]: null } },
    include: [{ model: Requisito, as: 'requisito', attributes: ['id', 'texto', 'tipo'] }],
    group: ['RespostaPartida.requisitoId', 'requisito.id', 'requisito.texto', 'requisito.tipo'],
    having: literal('COUNT(RespostaPartida.id) >= 1'),
    order: [[literal('totalErros'), 'DESC']],
    limit: limite
  });

  return registros
    .map((registro) => {
      const totalRespostas = Number(registro.get('totalRespostas'));
      const totalErros = Number(registro.get('totalErros'));
      return {
        requisito: registro.requisito ? registro.requisito.texto : 'Requisito removido',
        tipo: registro.requisito ? registro.requisito.tipo : null,
        totalRespostas,
        totalErros,
        taxaErro: totalRespostas > 0 ? Math.round((totalErros / totalRespostas) * 100) : 0
      };
    })
    .sort((primeiro, segundo) => segundo.taxaErro - primeiro.taxaErro);
}

async function listarUsuariosMaisAtivos(limite = 5) {
  const registros = await Partida.findAll({
    attributes: [
      'usuarioId',
      [fn('COUNT', col('Partida.id')), 'totalPartidas'],
      [fn('SUM', col('pontuacao')), 'pontuacaoTotal']
    ],
    where: { finalizadaEm: { [Op.ne]: null } },
    include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nome'] }],
    group: ['Partida.usuarioId', 'usuario.id', 'usuario.nome'],
    order: [[literal('totalPartidas'), 'DESC']],
    limit: limite
  });

  return registros.map((registro) => ({
    usuario: registro.usuario ? registro.usuario.nome : 'Usuario removido',
    totalPartidas: Number(registro.get('totalPartidas')),
    pontuacaoTotal: Number(registro.get('pontuacaoTotal'))
  }));
}

async function calcularAproveitamentoGeral() {
  const totalRespostas = await RespostaPartida.count({ where: { respondidaEm: { [Op.ne]: null } } });
  const totalAcertos = await RespostaPartida.count({ where: { correta: true } });

  return totalRespostas > 0 ? Math.round((totalAcertos / totalRespostas) * 100) : 0;
}

async function buscarIndicadores() {
  const [totais, temasMaisJogados, requisitosComMaiorErro, usuariosMaisAtivos, aproveitamentoGeral] =
    await Promise.all([
      contarTotais(),
      listarTemasMaisJogados(),
      listarRequisitosComMaiorErro(),
      listarUsuariosMaisAtivos(),
      calcularAproveitamentoGeral()
    ]);

  return { totais, temasMaisJogados, requisitosComMaiorErro, usuariosMaisAtivos, aproveitamentoGeral };
}

module.exports = { buscarIndicadores };
