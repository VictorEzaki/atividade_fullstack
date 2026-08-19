import { api } from './api';

export const temaService = {
  listarDisponiveis: () => api.buscar('/temas/disponiveis'),
  listar: (filtros) => api.buscar('/temas', filtros),
  buscarPorId: (id) => api.buscar(`/temas/${id}`),
  criar: (dados) => api.enviar('/temas', dados),
  atualizar: (id, dados) => api.substituir(`/temas/${id}`, dados),
  alterarSituacao: (id, ativo) => api.ajustar(`/temas/${id}/situacao`, { ativo }),
  excluir: (id) => api.remover(`/temas/${id}`),
  associarRequisitos: (id, requisitosIds) => api.enviar(`/temas/${id}/requisitos`, { requisitosIds }),
  removerAssociacao: (id, requisitoId) => api.remover(`/temas/${id}/requisitos/${requisitoId}`)
};
