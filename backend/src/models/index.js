const { Sequelize } = require('sequelize');
const configuracaoBanco = require('../config/database');

const sequelize = new Sequelize(
  configuracaoBanco.database,
  configuracaoBanco.username,
  configuracaoBanco.password,
  configuracaoBanco
);

const Usuario = require('./Usuario')(sequelize);
const Tema = require('./Tema')(sequelize);
const Requisito = require('./Requisito')(sequelize);
const Dificuldade = require('./Dificuldade')(sequelize);
const Partida = require('./Partida')(sequelize);
const RespostaPartida = require('./RespostaPartida')(sequelize);
const TemaRequisito = require('./TemaRequisito')(sequelize);

const modelos = { Usuario, Tema, Requisito, Dificuldade, Partida, RespostaPartida, TemaRequisito };

Object.values(modelos).forEach((modelo) => {
  if (typeof modelo.associar === 'function') {
    modelo.associar(modelos);
  }
});

module.exports = { sequelize, Sequelize, ...modelos };
