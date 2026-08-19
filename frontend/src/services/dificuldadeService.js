import { api } from './api';

export const dificuldadeService = {
  listar: (filtros) => api.buscar('/dificuldades', filtros),
  criar: (dados) => api.enviar('/dificuldades', dados),
  atualizar: (id, dados) => api.substituir(`/dificuldades/${id}`, dados),
  excluir: (id) => api.remover(`/dificuldades/${id}`)
};
