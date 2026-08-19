import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { autenticacaoService } from '../services/autenticacaoService';
import { guardarToken, recuperarToken, removerToken } from '../services/api';

const AutenticacaoContexto = createContext(null);

export function ProvedorAutenticacao({ children }) {
  const [usuario, definirUsuario] = useState(null);
  const [carregando, definirCarregando] = useState(true);

  useEffect(() => {
    async function restaurarSessao() {
      if (!recuperarToken()) {
        definirCarregando(false);
        return;
      }

      try {
        const dados = await autenticacaoService.buscarPerfil();
        definirUsuario(dados.usuario);
      } catch {
        removerToken();
      } finally {
        definirCarregando(false);
      }
    }

    restaurarSessao();
  }, []);

  const entrar = useCallback(async (credenciais) => {
    const dados = await autenticacaoService.entrar(credenciais);
    guardarToken(dados.token);
    definirUsuario(dados.usuario);
    return dados.usuario;
  }, []);

  const cadastrar = useCallback(async (dadosCadastro) => {
    const dados = await autenticacaoService.cadastrar(dadosCadastro);
    guardarToken(dados.token);
    definirUsuario(dados.usuario);
    return dados.usuario;
  }, []);

  const sair = useCallback(() => {
    removerToken();
    definirUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({
      usuario,
      carregando,
      autenticado: Boolean(usuario),
      administrador: usuario?.perfil === 'ADMINISTRADOR',
      entrar,
      cadastrar,
      sair
    }),
    [usuario, carregando, entrar, cadastrar, sair]
  );

  return <AutenticacaoContexto.Provider value={valor}>{children}</AutenticacaoContexto.Provider>;
}

export function usarAutenticacao() {
  const contexto = useContext(AutenticacaoContexto);

  if (!contexto) {
    throw new Error('usarAutenticacao precisa estar dentro do ProvedorAutenticacao.');
  }

  return contexto;
}
