import { api } from './api';

export const painelService = {
  buscarIndicadores: () => api.buscar('/painel/indicadores')
};
