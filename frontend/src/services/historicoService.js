import { api } from './api';

export const historicoService = {
  buscarHistorico: (filtros) => api.buscar('/historico', filtros),
  buscarResumo: () => api.buscar('/historico/resumo'),
  buscarDetalhesDaPartida: (partidaId) => api.buscar(`/historico/${partidaId}`)
};
