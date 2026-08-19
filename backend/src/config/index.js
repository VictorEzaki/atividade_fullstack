require('dotenv').config();

const configuracao = {
  ambiente: process.env.NODE_ENV || 'development',
  porta: Number(process.env.PORT || 3333),
  urlFrontend: process.env.FRONTEND_URL || 'http://localhost:5173',
  jwt: {
    segredo: process.env.JWT_SECRET || 'segredo-de-desenvolvimento',
    expiracao: process.env.JWT_EXPIRES_IN || '1d'
  },
  jogo: {
    requisitosPorPartida: 10,
    distratoresPorPartida: 3
  }
};

module.exports = configuracao;
