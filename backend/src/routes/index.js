const { Router } = require('express');

const rotas = Router();

rotas.get('/saude', (req, res) =>
  res.json({ sucesso: true, dados: { situacao: 'disponivel' }, mensagem: 'API disponivel.' })
);

rotas.use('/autenticacao', require('./autenticacaoRoutes'));
rotas.use('/usuarios', require('./usuarioRoutes'));
rotas.use('/temas', require('./temaRoutes'));
rotas.use('/requisitos', require('./requisitoRoutes'));
rotas.use('/dificuldades', require('./dificuldadeRoutes'));
rotas.use('/partidas', require('./partidaRoutes'));
rotas.use('/historico', require('./historicoRoutes'));
rotas.use('/ranking', require('./rankingRoutes'));
rotas.use('/painel', require('./painelRoutes'));

module.exports = rotas;
