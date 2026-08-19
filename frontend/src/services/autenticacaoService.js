import { api } from './api';

export const autenticacaoService = {
  cadastrar: (dados) => api.enviar('/autenticacao/cadastro', dados),
  entrar: (dados) => api.enviar('/autenticacao/login', dados),
  buscarPerfil: () => api.buscar('/autenticacao/perfil')
};
