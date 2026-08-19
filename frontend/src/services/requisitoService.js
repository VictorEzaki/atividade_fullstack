import { api } from './api';

export const requisitoService = {
  listar: (filtros) => api.buscar('/requisitos', filtros),
  buscarPorId: (id) => api.buscar(`/requisitos/${id}`),
  criar: (dados) => api.enviar('/requisitos', dados),
  atualizar: (id, dados) => api.substituir(`/requisitos/${id}`, dados),
  excluir: (id) => api.remover(`/requisitos/${id}`)
};
