import { useCallback, useEffect, useState } from 'react';
import { usuarioService } from '../../services/usuarioService';
import Cartao from '../../components/Cartao';
import Botao from '../../components/Botao';
import CampoTexto from '../../components/CampoTexto';
import CampoSelecao from '../../components/CampoSelecao';
import Tabela from '../../components/Tabela';
import Modal from '../../components/Modal';
import Carregamento from '../../components/Carregamento';
import MensagemErro from '../../components/MensagemErro';

const FORMULARIO_VAZIO = { nome: '', email: '', senha: '', perfil: 'JOGADOR' };

export default function Usuarios() {
  const [usuarios, definirUsuarios] = useState([]);
  const [filtros, definirFiltros] = useState({ busca: '', perfil: '' });
  const [formulario, definirFormulario] = useState(FORMULARIO_VAZIO);
  const [emEdicao, definirEmEdicao] = useState(null);
  const [modalAberto, definirModalAberto] = useState(false);
  const [exclusao, definirExclusao] = useState(null);
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState('');

  const carregarUsuarios = useCallback(async () => {
    definirCarregando(true);
    try {
      const dados = await usuarioService.listar(filtros);
      definirUsuarios(dados.usuarios);
      definirErro('');
    } catch (falha) {
      definirErro(falha.message);
    } finally {
      definirCarregando(false);
    }
  }, [filtros]);

  useEffect(() => {
    const atraso = setTimeout(carregarUsuarios, 250);
    return () => clearTimeout(atraso);
  }, [carregarUsuarios]);

  function abrirCriacao() {
    definirEmEdicao(null);
    definirFormulario(FORMULARIO_VAZIO);
    definirModalAberto(true);
  }

  function abrirEdicao(usuario) {
    definirEmEdicao(usuario);
    definirFormulario({ nome: usuario.nome, email: usuario.email, senha: '', perfil: usuario.perfil });
    definirModalAberto(true);
  }

  async function salvar(evento) {
    evento.preventDefault();

    try {
      const dados = { ...formulario };
      if (emEdicao && !dados.senha) delete dados.senha;

      if (emEdicao) {
        await usuarioService.atualizar(emEdicao.id, dados);
      } else {
        await usuarioService.criar(dados);
      }

      definirModalAberto(false);
      carregarUsuarios();
    } catch (falha) {
      definirErro(falha.message);
    }
  }

  async function confirmarExclusao() {
    try {
      await usuarioService.excluir(exclusao.id);
      definirExclusao(null);
      carregarUsuarios();
    } catch (falha) {
      definirErro(falha.message);
      definirExclusao(null);
    }
  }

  const colunas = [
    { campo: 'nome', titulo: 'Nome' },
    { campo: 'email', titulo: 'E-mail' },
    {
      campo: 'perfil',
      titulo: 'Perfil',
      conteudo: (item) => (
        <span className={`etiqueta etiqueta--${item.perfil === 'ADMINISTRADOR' ? 'secundaria' : 'primaria'}`}>
          {item.perfil === 'ADMINISTRADOR' ? 'Administrador' : 'Jogador'}
        </span>
      )
    },
    {
      campo: 'acoes',
      titulo: 'Acoes',
      conteudo: (item) => (
        <div className="linha">
          <Botao variante="texto" tamanho="pequeno" icone="fa-solid fa-pen" onClick={() => abrirEdicao(item)}>
            Editar
          </Botao>
          <Botao
            variante="perigo-texto"
            tamanho="pequeno"
            icone="fa-solid fa-trash"
            onClick={() => definirExclusao(item)}
          >
            Excluir
          </Botao>
        </div>
      )
    }
  ];

  return (
    <div className="pilha" style={{ gap: 'var(--espaco-6)' }}>
      <div className="cabecalho-pagina">
        <div>
          <span className="rotulo-secao">Administracao</span>
          <h1>Usuarios</h1>
        </div>
        <Botao icone="fa-solid fa-user-plus" onClick={abrirCriacao}>
          Novo usuario
        </Botao>
      </div>

      <MensagemErro mensagem={erro} />

      <Cartao>
        <div className="filtros">
          <CampoTexto
            rotulo="Pesquisar"
            placeholder="Nome ou e-mail"
            value={filtros.busca}
            onChange={(evento) => definirFiltros((atual) => ({ ...atual, busca: evento.target.value }))}
          />
          <CampoSelecao
            rotulo="Perfil"
            placeholder="Todos os perfis"
            value={filtros.perfil}
            onChange={(evento) => definirFiltros((atual) => ({ ...atual, perfil: evento.target.value }))}
            opcoes={[
              { valor: 'JOGADOR', texto: 'Jogador' },
              { valor: 'ADMINISTRADOR', texto: 'Administrador' }
            ]}
          />
        </div>
      </Cartao>

      <Cartao>{carregando ? <Carregamento /> : <Tabela colunas={colunas} dados={usuarios} />}</Cartao>

      <Modal
        aberto={modalAberto}
        titulo={emEdicao ? 'Editar usuario' : 'Novo usuario'}
        aoFechar={() => definirModalAberto(false)}
      >
        <form className="pilha" onSubmit={salvar}>
          <CampoTexto
            rotulo="Nome"
            value={formulario.nome}
            onChange={(evento) => definirFormulario((atual) => ({ ...atual, nome: evento.target.value }))}
            required
          />
          <CampoTexto
            rotulo="E-mail"
            type="email"
            value={formulario.email}
            onChange={(evento) => definirFormulario((atual) => ({ ...atual, email: evento.target.value }))}
            required
          />
          <CampoTexto
            rotulo="Senha"
            type="password"
            value={formulario.senha}
            onChange={(evento) => definirFormulario((atual) => ({ ...atual, senha: evento.target.value }))}
            ajuda={emEdicao ? 'Deixe em branco para manter a senha atual.' : 'Minimo de 6 caracteres.'}
            required={!emEdicao}
          />
          <CampoSelecao
            rotulo="Perfil"
            value={formulario.perfil}
            onChange={(evento) => definirFormulario((atual) => ({ ...atual, perfil: evento.target.value }))}
            opcoes={[
              { valor: 'JOGADOR', texto: 'Jogador' },
              { valor: 'ADMINISTRADOR', texto: 'Administrador' }
            ]}
          />
          <Botao type="submit" icone="fa-solid fa-floppy-disk">
            Salvar usuario
          </Botao>
        </form>
      </Modal>

      <Modal
        aberto={Boolean(exclusao)}
        titulo="Excluir usuario"
        aoFechar={() => definirExclusao(null)}
        rodape={
          <div className="linha">
            <Botao variante="secundario" onClick={() => definirExclusao(null)}>
              Cancelar
            </Botao>
            <Botao variante="perigo" icone="fa-solid fa-trash" onClick={confirmarExclusao}>
              Excluir
            </Botao>
          </div>
        }
      >
        <p>
          Excluir <strong>{exclusao?.nome}</strong> remove tambem o historico de partidas desse jogador. Essa acao
          nao pode ser desfeita.
        </p>
      </Modal>
    </div>
  );
}
