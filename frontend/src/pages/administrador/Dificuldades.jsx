import { useCallback, useEffect, useState } from 'react';
import { dificuldadeService } from '../../services/dificuldadeService';
import Cartao from '../../components/Cartao';
import Botao from '../../components/Botao';
import CampoTexto from '../../components/CampoTexto';
import Tabela from '../../components/Tabela';
import Modal from '../../components/Modal';
import Carregamento from '../../components/Carregamento';
import MensagemErro from '../../components/MensagemErro';

const FORMULARIO_VAZIO = { nome: '', tempo: 60, pontos: 10, ativo: true };

export default function Dificuldades() {
  const [dificuldades, definirDificuldades] = useState([]);
  const [formulario, definirFormulario] = useState(FORMULARIO_VAZIO);
  const [emEdicao, definirEmEdicao] = useState(null);
  const [modalAberto, definirModalAberto] = useState(false);
  const [exclusao, definirExclusao] = useState(null);
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState('');

  const carregarDificuldades = useCallback(async () => {
    definirCarregando(true);
    try {
      const dados = await dificuldadeService.listar();
      definirDificuldades(dados.dificuldades);
      definirErro('');
    } catch (falha) {
      definirErro(falha.message);
    } finally {
      definirCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarDificuldades();
  }, [carregarDificuldades]);

  function abrirCriacao() {
    definirEmEdicao(null);
    definirFormulario(FORMULARIO_VAZIO);
    definirModalAberto(true);
  }

  function abrirEdicao(dificuldade) {
    definirEmEdicao(dificuldade);
    definirFormulario({
      nome: dificuldade.nome,
      tempo: dificuldade.tempo,
      pontos: dificuldade.pontos,
      ativo: dificuldade.ativo
    });
    definirModalAberto(true);
  }

  async function salvar(evento) {
    evento.preventDefault();
    try {
      if (emEdicao) {
        await dificuldadeService.atualizar(emEdicao.id, formulario);
      } else {
        await dificuldadeService.criar(formulario);
      }
      definirModalAberto(false);
      carregarDificuldades();
    } catch (falha) {
      definirErro(falha.message);
    }
  }

  async function confirmarExclusao() {
    try {
      await dificuldadeService.excluir(exclusao.id);
      definirExclusao(null);
      carregarDificuldades();
    } catch (falha) {
      definirErro(falha.message);
      definirExclusao(null);
    }
  }

  const colunas = [
    { campo: 'nome', titulo: 'Dificuldade' },
    { campo: 'tempo', titulo: 'Tempo', conteudo: (item) => `${item.tempo}s` },
    { campo: 'pontos', titulo: 'Pontos por acerto' },
    {
      campo: 'ativo',
      titulo: 'Situação',
      conteudo: (item) => (
        <span className={`etiqueta etiqueta--${item.ativo ? 'sucesso' : 'neutra'}`}>
          {item.ativo ? 'Ativa' : 'Inativa'}
        </span>
      )
    },
    {
      campo: 'acoes',
      titulo: 'Ações',
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
          <span className="rotulo-secao">Administração</span>
          <h1>Dificuldades</h1>
        </div>
        <Botao icone="fa-solid fa-plus" onClick={abrirCriacao}>
          Nova dificuldade
        </Botao>
      </div>

      <MensagemErro mensagem={erro} />

      <Cartao>{carregando ? <Carregamento /> : <Tabela colunas={colunas} dados={dificuldades} />}</Cartao>

      <Modal
        aberto={modalAberto}
        titulo={emEdicao ? 'Editar dificuldade' : 'Nova dificuldade'}
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
            rotulo="Tempo total da partida (segundos)"
            type="number"
            min={10}
            value={formulario.tempo}
            onChange={(evento) => definirFormulario((atual) => ({ ...atual, tempo: evento.target.value }))}
            required
          />
          <CampoTexto
            rotulo="Pontos por acerto"
            type="number"
            min={1}
            value={formulario.pontos}
            onChange={(evento) => definirFormulario((atual) => ({ ...atual, pontos: evento.target.value }))}
            required
          />
          <label className="alternador">
            <input
              type="checkbox"
              checked={formulario.ativo}
              onChange={(evento) => definirFormulario((atual) => ({ ...atual, ativo: evento.target.checked }))}
            />
            <span>Dificuldade disponível para os jogadores</span>
          </label>
          <Botao type="submit" icone="fa-solid fa-floppy-disk">
            Salvar dificuldade
          </Botao>
        </form>
      </Modal>

      <Modal
        aberto={Boolean(exclusao)}
        titulo="Excluir dificuldade"
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
          Dificuldades já usadas em partidas não podem ser excluídas. Nesse caso, desative a dificuldade para tirá-la
          da tela de nova partida.
        </p>
      </Modal>
    </div>
  );
}
