const express = require('express');
const cors = require('cors');

const rotas = require('./routes');
const configuracao = require('./config');
const erroMiddleware = require('./middlewares/erroMiddleware');
const naoEncontradoMiddleware = require('./middlewares/naoEncontradoMiddleware');

const aplicacao = express();

aplicacao.use(
  cors({
    origin: configuracao.urlFrontend,
    credentials: true
  })
);
aplicacao.use(express.json());

aplicacao.use('/api', rotas);

aplicacao.use(naoEncontradoMiddleware);
aplicacao.use(erroMiddleware);

module.exports = aplicacao;
