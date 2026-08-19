const configuracoes = require('./sequelizeCli');

const ambiente = process.env.NODE_ENV || 'development';

module.exports = configuracoes[ambiente];
