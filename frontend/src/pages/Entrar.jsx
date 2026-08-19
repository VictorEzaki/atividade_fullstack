import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usarAutenticacao } from '../contexts/AutenticacaoContexto';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import MensagemErro from '../components/MensagemErro';

export default function Entrar() {
  const { entrar } = usarAutenticacao();
  const navegar = useNavigate();

  const [formulario, definirFormulario] = useState({ email: '', senha: '' });
  const [erro, definirErro] = useState('');
  const [enviando, definirEnviando] = useState(false);

  function alterarCampo(evento) {
    const { name, value } = evento.target;
    definirFormulario((atual) => ({ ...atual, [name]: value }));
  }

  async function enviarFormulario(evento) {
    evento.preventDefault();
    definirErro('');
    definirEnviando(true);

    try {
      const usuario = await entrar(formulario);
      navegar(usuario.perfil === 'ADMINISTRADOR' ? '/administracao' : '/', { replace: true });
    } catch (falha) {
      definirErro(falha.message);
    } finally {
      definirEnviando(false);
    }
  }

  return (
    <div className="painel-formulario">
      <h2>Entrar</h2>
      <p className="texto-secundario">Use sua conta para jogar e acompanhar sua evolucao.</p>

      <MensagemErro mensagem={erro} />

      <form className="pilha" onSubmit={enviarFormulario}>
        <CampoTexto
          rotulo="E-mail"
          name="email"
          type="email"
          value={formulario.email}
          onChange={alterarCampo}
          autoComplete="email"
          required
        />
        <CampoTexto
          rotulo="Senha"
          name="senha"
          type="password"
          value={formulario.senha}
          onChange={alterarCampo}
          autoComplete="current-password"
          required
        />
        <Botao type="submit" carregando={enviando} icone="fa-solid fa-arrow-right-to-bracket">
          Entrar
        </Botao>
      </form>

      <p className="texto-secundario">
        Ainda nao tem conta? <Link to="/cadastro">Criar cadastro</Link>
      </p>
    </div>
  );
}
