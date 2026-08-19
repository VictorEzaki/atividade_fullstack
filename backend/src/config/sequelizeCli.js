require('dotenv').config();

const configuracaoComum = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || null,
  database: process.env.DB_NAME || 'jogo_requisitos',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  dialect: 'mysql',
  define: { freezeTableName: true },
  logging: false
};

module.exports = {
  development: configuracaoComum,
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    define: { freezeTableName: true },
    logging: false
  },
  production: configuracaoComum
};
