const { Op } = require('sequelize');
const { Dificuldade, Partida } = require('../models');
const ErroAplicacao = require('../utils/ErroAplicacao');

async function listar({ apenasAtivas = false } = {}) {
  const filtros = apenasAtivas ? { ativo: true } : {};
  return Dificuldade.findAll({ where: filtros, order: [['tempo', 'DESC']] });
}

async function buscarPorId(id) {
  const dificuldade = await Dificuldade.findByPk(id);
  if (!dificuldade) {
    throw new ErroAplicacao('Dificuldade nao encontrada.', 404);
  }
  return dificuldade;
}

function validarValores({ tempo, pontos }) {
  if (tempo !== undefined && (Number.isNaN(Number(tempo)) || Number(tempo) < 10)) {
    throw new ErroAplicacao('O tempo deve ser um numero de no minimo 10 segundos.', 422);
  }
  if (pontos !== undefined && (Number.isNaN(Number(pontos)) || Number(pontos) < 1)) {
    throw new ErroAplicacao('Os pontos devem ser um numero maior que zero.', 422);
  }
}

async function criar({ nome, tempo, pontos = 10, ativo = true }) {
  if (!nome || tempo === undefined) {
    throw new ErroAplicacao('Informe o nome e o tempo da dificuldade.', 422);
  }
  validarValores({ tempo, pontos });

  const jaExiste = await Dificuldade.findOne({ where: { nome: String(nome).trim() } });
  if (jaExiste) {
    throw new ErroAplicacao('Ja existe uma dificuldade com este nome.', 409);
  }

  return Dificuldade.create({
    nome: String(nome).trim(),
    tempo: Number(tempo),
    pontos: Number(pontos),
    ativo: ativo !== false
  });
}

async function atualizar(id, { nome, tempo, pontos, ativo }) {
  const dificuldade = await buscarPorId(id);
  validarValores({ tempo, pontos });

  if (nome && String(nome).trim() !== dificuldade.nome) {
    const emUso = await Dificuldade.findOne({
      where: { nome: String(nome).trim(), id: { [Op.ne]: dificuldade.id } }
    });
    if (emUso) {
      throw new ErroAplicacao('Ja existe uma dificuldade com este nome.', 409);
    }
    dificuldade.nome = String(nome).trim();
  }

  if (tempo !== undefined) dificuldade.tempo = Number(tempo);
  if (pontos !== undefined) dificuldade.pontos = Number(pontos);
  if (ativo !== undefined) dificuldade.ativo = ativo === true || ativo === 'true';

  await dificuldade.save();
  return dificuldade;
}

async function excluir(id) {
  const dificuldade = await buscarPorId(id);

  const partidasVinculadas = await Partida.count({ where: { dificuldadeId: dificuldade.id } });
  if (partidasVinculadas > 0) {
    throw new ErroAplicacao('Nao e possivel excluir uma dificuldade ja utilizada em partidas. Desative-a.', 409);
  }

  await dificuldade.destroy();
  return true;
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
