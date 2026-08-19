import { api } from './api';

export const partidaService = {
  iniciarPartida: (temaId, dificuldadeId) => api.enviar('/partidas', { temaId, dificuldadeId }),
  buscarEstado: (partidaId) => api.buscar(`/partidas/${partidaId}`),
  responderRequisito: (partidaId, ordem, resposta) =>
    api.enviar(`/partidas/${partidaId}/respostas`, { ordem, resposta }),
  finalizarPartida: (partidaId) => api.enviar(`/partidas/${partidaId}/finalizacao`),
  buscarResultado: (partidaId) => api.buscar(`/partidas/${partidaId}/resultado`)
};
