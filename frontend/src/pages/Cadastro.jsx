import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usarAutenticacao } from '../contexts/AutenticacaoContexto';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import MensagemErro from '../components/MensagemErro';

export default function Cadastro() {
  const { cadastrar } = usarAutenticacao();
  const navegar = useNavigate();

  const [formulario, definirFormulario] = useState({ nome: '', email: '', senha: '', confirmacao: '' });
  const [erro, definirErro] = useState('');
  const [enviando, definirEnviando] = useState(false);

  function alterarCampo(evento) {
    const { name, value } = evento.target;
    definirFormulario((atual) => ({ ...atual, [name]: value }));
  }

  async function enviarFormulario(evento) {
    evento.preventDefault();
    definirErro('');

    if (formulario.senha !== formulario.confirmacao) {
      definirErro('As senhas informadas nao sao iguais.');
      return;
    }

    definirEnviando(true);
    try {
      await cadastrar({ nome: formulario.nome, email: formulario.email, senha: formulario.senha });
      navegar('/', { replace: true });
    } catch (falha) {
      definirErro(falha.message);
    } finally {
      definirEnviando(false);
    }
  }

  return (
    <div className="painel-formulario">
      <h2>Criar cadastro</h2>
      <p className="texto-secundario">Leva menos de um minuto e ja libera a primeira partida.</p>

      <MensagemErro mensagem={erro} />

      <form className="pilha" onSubmit={enviarFormulario}>
        <CampoTexto rotulo="Nome" name="nome" value={formulario.nome} onChange={alterarCampo} required minLength={3} />
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
          ajuda="Use ao menos 6 caracteres."
          autoComplete="new-password"
          required
          minLength={6}
        />
        <CampoTexto
          rotulo="Confirmar senha"
          name="confirmacao"
          type="password"
          value={formulario.confirmacao}
          onChange={alterarCampo}
          autoComplete="new-password"
          required
        />
        <Botao type="submit" carregando={enviando} icone="fa-solid fa-user-plus">
          Criar cadastro
        </Botao>
      </form>

      <p className="texto-secundario">
        Ja tem conta? <Link to="/entrar">Entrar</Link>
      </p>
    </div>
  );
}
