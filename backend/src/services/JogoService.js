const { Op } = require('sequelize');
const {
  sequelize,
  Partida,
  RespostaPartida,
  Requisito,
  Tema,
  Dificuldade,
  TemaRequisito
} = require('../models');
const ErroAplicacao = require('../utils/ErroAplicacao');
const { embaralhar } = require('../utils/embaralhar');
const { RESPOSTAS_POSSIVEIS, NAO_CONDIZ_COM_TEMA } = require('../utils/constantes');
const configuracao = require('../config');

const TOTAL_REQUISITOS = configuracao.jogo.requisitosPorPartida;
const TOTAL_DISTRATORES = configuracao.jogo.distratoresPorPartida;
const TOTAL_DO_TEMA = TOTAL_REQUISITOS - TOTAL_DISTRATORES;

/** Tolerancia para compensar latencia de rede ao validar o tempo. */
const TOLERANCIA_SEGUNDOS = 2;

function segundosEntre(inicio, fim) {
  return Math.max(0, Math.floor((fim.getTime() - inicio.getTime()) / 1000));
}

function calcularTempoDecorrido(partida) {
  return segundosEntre(new Date(partida.iniciadaEm), new Date());
}

function calcularTempoRestante(partida, tempoConfigurado) {
  return Math.max(0, tempoConfigurado - calcularTempoDecorrido(partida));
}

/** Sorteia os requisitos do tema e os distratores que comporao a partida. */
async function selecionarRequisitosDaPartida(temaId) {
  const vinculos = await TemaRequisito.findAll({ where: { temaId }, attributes: ['requisitoId'] });
  const idsDoTema = vinculos.map((vinculo) => vinculo.requisitoId);

  if (idsDoTema.length < TOTAL_DO_TEMA) {
    throw new ErroAplicacao(
      `Este tema possui apenas ${idsDoTema.length} requisitos associados. Sao necessarios ao menos ${TOTAL_DO_TEMA}.`,
      422
    );
  }

  const requisitosDoTema = await Requisito.findAll({ where: { id: idsDoTema } });
  const distratoresDisponiveis = await Requisito.findAll({
    where: idsDoTema.length > 0 ? { id: { [Op.notIn]: idsDoTema } } : {}
  });

  if (distratoresDisponiveis.length < TOTAL_DISTRATORES) {
    throw new ErroAplicacao(
      `Nao ha requisitos suficientes de outros temas para compor a partida. Sao necessarios ao menos ${TOTAL_DISTRATORES}.`,
      422
    );
  }

  const selecionadosDoTema = embaralhar(requisitosDoTema)
    .slice(0, TOTAL_DO_TEMA)
    .map((requisito) => ({ requisito, pertenceAoTema: true }));

  const selecionadosDistratores = embaralhar(distratoresDisponiveis)
    .slice(0, TOTAL_DISTRATORES)
    .map((requisito) => ({ requisito, pertenceAoTema: false }));

  return embaralhar([...selecionadosDoTema, ...selecionadosDistratores]);
}

/** Representacao enviada ao frontend: nunca inclui a resposta correta. */
function apresentarQuestao(resposta, partida, tempoConfigurado) {
  return {
    ordem: resposta.ordem,
    total: TOTAL_REQUISITOS,
    requisito: {
      id: resposta.requisito.id,
      texto: resposta.requisito.texto
    },
    tempoRestante: calcularTempoRestante(partida, tempoConfigurado)
  };
}

async function carregarPartidaDoUsuario(partidaId, usuarioId) {
  const partida = await Partida.findByPk(partidaId, {
    include: [
      { model: Dificuldade, as: 'dificuldade' },
      { model: Tema, as: 'tema' }
    ]
  });

  if (!partida) {
    throw new ErroAplicacao('Partida nao encontrada.', 404);
  }
  if (partida.usuarioId !== Number(usuarioId)) {
    throw new ErroAplicacao('Esta partida nao pertence ao usuario autenticado.', 403);
  }

  return partida;
}

async function iniciarPartida(usuarioId, { temaId, dificuldadeId }) {
  if (!temaId || !dificuldadeId) {
    throw new ErroAplicacao('Informe o tema e a dificuldade da partida.', 422);
  }

  const tema = await Tema.findByPk(temaId);
  if (!tema || !tema.ativo) {
    throw new ErroAplicacao('Tema invalido ou indisponivel.', 422);
  }

  const dificuldade = await Dificuldade.findByPk(dificuldadeId);
  if (!dificuldade || !dificuldade.ativo) {
    throw new ErroAplicacao('Dificuldade invalida ou indisponivel.', 422);
  }

  await encerrarPartidasAbandonadas(usuarioId);

  const selecionados = await selecionarRequisitosDaPartida(tema.id);

  const partidaCriada = await sequelize.transaction(async (transacao) => {
    const partida = await Partida.create(
      {
        usuarioId,
        temaId: tema.id,
        dificuldadeId: dificuldade.id,
        pontuacao: 0,
        iniciadaEm: new Date()
      },
      { transaction: transacao }
    );

    const respostas = selecionados.map((item, indice) => ({
      partidaId: partida.id,
      requisitoId: item.requisito.id,
      ordem: indice + 1,
      pertenceAoTema: item.pertenceAoTema,
      respostaCorreta: item.pertenceAoTema ? item.requisito.tipo : NAO_CONDIZ_COM_TEMA,
      correta: false,
      criadaEm: new Date()
    }));

    await RespostaPartida.bulkCreate(respostas, { transaction: transacao });

    return partida;
  });

  return obterEstadoDaPartida(partidaCriada.id, usuarioId);
}

/** Fecha partidas antigas que ficaram abertas para nao poluir o historico. */
async function encerrarPartidasAbandonadas(usuarioId) {
  const partidasAbertas = await Partida.findAll({
    where: { usuarioId, finalizadaEm: null },
    include: [{ model: Dificuldade, as: 'dificuldade' }]
  });

  for (const partida of partidasAbertas) {
    await finalizarPartida(partida.id, usuarioId, { porTempoEsgotado: true });
  }
}

async function obterEstadoDaPartida(partidaId, usuarioId) {
  const partida = await carregarPartidaDoUsuario(partidaId, usuarioId);

  if (partida.finalizadaEm) {
    return { finalizada: true, resultado: await montarResultado(partida) };
  }

  const tempoConfigurado = partida.dificuldade.tempo;
  if (calcularTempoDecorrido(partida) > tempoConfigurado + TOLERANCIA_SEGUNDOS) {
    const resultado = await finalizarPartida(partida.id, usuarioId, { porTempoEsgotado: true });
    return { finalizada: true, tempoEsgotado: true, resultado };
  }

  const proxima = await RespostaPartida.findOne({
    where: { partidaId: partida.id, respondidaEm: null },
    include: [{ model: Requisito, as: 'requisito' }],
    order: [['ordem', 'ASC']]
  });

  if (!proxima) {
    const resultado = await finalizarPartida(partida.id, usuarioId);
    return { finalizada: true, resultado };
  }

  const respondidas = await RespostaPartida.count({
    where: { partidaId: partida.id, respondidaEm: { [Op.ne]: null } }
  });

  return {
    finalizada: false,
    partida: {
      id: partida.id,
      tema: { id: partida.tema.id, nome: partida.tema.nome },
      dificuldade: {
        id: partida.dificuldade.id,
        nome: partida.dificuldade.nome,
        tempo: partida.dificuldade.tempo,
        pontos: partida.dificuldade.pontos
      },
      pontuacao: partida.pontuacao,
      respondidas,
      total: TOTAL_REQUISITOS
    },
    questao: apresentarQuestao(proxima, partida, tempoConfigurado)
  };
}

async function responderRequisito(usuarioId, partidaId, { ordem, resposta }) {
  const partida = await carregarPartidaDoUsuario(partidaId, usuarioId);

  if (partida.finalizadaEm) {
    throw new ErroAplicacao('Esta partida ja foi finalizada.', 409);
  }

  if (!RESPOSTAS_POSSIVEIS.includes(resposta)) {
    throw new ErroAplicacao('Alternativa invalida.', 422);
  }

  const tempoConfigurado = partida.dificuldade.tempo;
  if (calcularTempoDecorrido(partida) > tempoConfigurado + TOLERANCIA_SEGUNDOS) {
    const resultado = await finalizarPartida(partida.id, usuarioId, { porTempoEsgotado: true });
    return { tempoEsgotado: true, finalizada: true, resultado };
  }

  const registro = await RespostaPartida.findOne({
    where: { partidaId: partida.id, ordem: Number(ordem) }
  });

  if (!registro) {
    throw new ErroAplicacao('Questao nao encontrada nesta partida.', 404);
  }
  if (registro.respondidaEm) {
    throw new ErroAplicacao('Esta questao ja foi respondida.', 409);
  }

  const agora = new Date();
  const ultimaRespondida = await RespostaPartida.findOne({
    where: { partidaId: partida.id, respondidaEm: { [Op.ne]: null } },
    order: [['respondidaEm', 'DESC']]
  });
  const referencia = ultimaRespondida ? new Date(ultimaRespondida.respondidaEm) : new Date(partida.iniciadaEm);

  const acertou = registro.respostaCorreta === resposta;

  const pontuacaoAtualizada = await sequelize.transaction(async (transacao) => {
    registro.respostaEscolhida = resposta;
    registro.correta = acertou;
    registro.respondidaEm = agora;
    registro.tempoResposta = segundosEntre(referencia, agora);
    await registro.save({ transaction: transacao });

    const totalCorretas = await RespostaPartida.count({
      where: { partidaId: partida.id, correta: true },
      transaction: transacao
    });

    partida.pontuacao = totalCorretas * partida.dificuldade.pontos;
    await partida.save({ transaction: transacao });

    return partida.pontuacao;
  });

  const pendentes = await RespostaPartida.count({
    where: { partidaId: partida.id, respondidaEm: null }
  });

  const feedback = {
    correta: acertou,
    respostaCorreta: registro.respostaCorreta,
    respostaEscolhida: resposta,
    pontuacao: pontuacaoAtualizada,
    respondidas: TOTAL_REQUISITOS - pendentes,
    total: TOTAL_REQUISITOS,
    tempoRestante: calcularTempoRestante(partida, tempoConfigurado)
  };

  if (pendentes === 0) {
    const resultado = await finalizarPartida(partida.id, usuarioId);
    return { ...feedback, finalizada: true, resultado };
  }

  return { ...feedback, finalizada: false };
}

async function finalizarPartida(partidaId, usuarioId, { porTempoEsgotado = false } = {}) {
  const partida = await carregarPartidaDoUsuario(partidaId, usuarioId);

  if (partida.finalizadaEm) {
    return montarResultado(partida);
  }

  const tempoConfigurado = partida.dificuldade.tempo;
  const decorrido = calcularTempoDecorrido(partida);
  const tempoTotal = porTempoEsgotado ? Math.min(decorrido, tempoConfigurado) : Math.min(decorrido, tempoConfigurado);

  await sequelize.transaction(async (transacao) => {
    const totalCorretas = await RespostaPartida.count({
      where: { partidaId: partida.id, correta: true },
      transaction: transacao
    });

    partida.pontuacao = totalCorretas * partida.dificuldade.pontos;
    partida.tempoTotal = tempoTotal;
    partida.finalizadaEm = new Date();
    await partida.save({ transaction: transacao });
  });

  return montarResultado(partida, { encerradaPorTempo: porTempoEsgotado });
}

async function montarResultado(partida, { encerradaPorTempo = false } = {}) {
  const respostas = await RespostaPartida.findAll({
    where: { partidaId: partida.id },
    include: [{ model: Requisito, as: 'requisito' }],
    order: [['ordem', 'ASC']]
  });

  const acertos = respostas.filter((resposta) => resposta.correta).length;
  const naoRespondidas = respostas.filter((resposta) => !resposta.respondidaEm).length;

  return {
    partidaId: partida.id,
    tema: partida.tema ? { id: partida.tema.id, nome: partida.tema.nome } : null,
    dificuldade: partida.dificuldade
      ? { id: partida.dificuldade.id, nome: partida.dificuldade.nome, pontos: partida.dificuldade.pontos }
      : null,
    pontuacao: partida.pontuacao,
    tempoTotal: partida.tempoTotal,
    acertos,
    erros: respostas.length - acertos - naoRespondidas,
    naoRespondidas,
    total: respostas.length,
    encerradaPorTempo,
    iniciadaEm: partida.iniciadaEm,
    finalizadaEm: partida.finalizadaEm,
    revisao: respostas.map((resposta) => ({
      ordem: resposta.ordem,
      requisito: resposta.requisito.texto,
      respostaEscolhida: resposta.respostaEscolhida,
      respostaCorreta: resposta.respostaCorreta,
      correta: resposta.correta,
      tempoResposta: resposta.tempoResposta
    }))
  };
}

async function buscarResultado(partidaId, usuarioId) {
  const partida = await carregarPartidaDoUsuario(partidaId, usuarioId);

  if (!partida.finalizadaEm) {
    throw new ErroAplicacao('Esta partida ainda esta em andamento.', 409);
  }

  return montarResultado(partida);
}

module.exports = {
  iniciarPartida,
  obterEstadoDaPartida,
  responderRequisito,
  finalizarPartida,
  buscarResultado,
  montarResultado
};
