const URL_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';
const CHAVE_TOKEN = 'jogo-requisitos:token';

export function guardarToken(token) {
  localStorage.setItem(CHAVE_TOKEN, token);
}

export function recuperarToken() {
  return localStorage.getItem(CHAVE_TOKEN);
}

export function removerToken() {
  localStorage.removeItem(CHAVE_TOKEN);
}

function montarParametros(parametros = {}) {
  const busca = new URLSearchParams();

  Object.entries(parametros).forEach(([chave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') {
      busca.append(chave, valor);
    }
  });

  const textoBusca = busca.toString();
  return textoBusca ? `?${textoBusca}` : '';
}

async function requisitar(caminho, { metodo = 'GET', corpo, parametros } = {}) {
  const token = recuperarToken();

  const cabecalhos = { 'Content-Type': 'application/json' };
  if (token) {
    cabecalhos.Authorization = `Bearer ${token}`;
  }

  let resposta;
  try {
    resposta = await fetch(`${URL_BASE}${caminho}${montarParametros(parametros)}`, {
      method: metodo,
      headers: cabecalhos,
      body: corpo ? JSON.stringify(corpo) : undefined
    });
  } catch (erro) {
    throw new Error('Nao foi possivel falar com o servidor. Verifique sua conexao.');
  }

  const conteudo = await resposta.json().catch(() => ({}));

  if (resposta.status === 401) {
    removerToken();
  }

  if (!resposta.ok || conteudo.sucesso === false) {
    const erro = new Error(conteudo.mensagem || 'Nao foi possivel realizar a operacao.');
    erro.status = resposta.status;
    throw erro;
  }

  return conteudo.dados;
}

export const api = {
  buscar: (caminho, parametros) => requisitar(caminho, { metodo: 'GET', parametros }),
  enviar: (caminho, corpo) => requisitar(caminho, { metodo: 'POST', corpo }),
  substituir: (caminho, corpo) => requisitar(caminho, { metodo: 'PUT', corpo }),
  ajustar: (caminho, corpo) => requisitar(caminho, { metodo: 'PATCH', corpo }),
  remover: (caminho) => requisitar(caminho, { metodo: 'DELETE' })
};
