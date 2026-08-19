require('dotenv').config();

const aplicacao = require('./src/app');
const { sequelize } = require('./src/models');
const configuracao = require('./src/config');

async function iniciarServidor() {
  try {
    await sequelize.authenticate();
    aplicacao.listen(configuracao.porta, () => {
      console.log(`Servidor disponivel em http://localhost:${configuracao.porta}`);
    });
  } catch (erro) {
    console.error('Nao foi possivel conectar ao banco de dados.', erro.message);
    process.exit(1);
  }
}

iniciarServidor();
