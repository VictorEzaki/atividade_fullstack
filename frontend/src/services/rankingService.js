import { api } from './api';

export const rankingService = {
  listarRanking: (filtros) => api.buscar('/ranking', filtros)
};
