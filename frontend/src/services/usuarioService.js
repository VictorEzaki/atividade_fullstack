import { api } from './api';

export const usuarioService = {
  listar: (filtros) => api.buscar('/usuarios', filtros),
  buscarPorId: (id) => api.buscar(`/usuarios/${id}`),
  criar: (dados) => api.enviar('/usuarios', dados),
  atualizar: (id, dados) => api.substituir(`/usuarios/${id}`, dados),
  excluir: (id) => api.remover(`/usuarios/${id}`)
};
