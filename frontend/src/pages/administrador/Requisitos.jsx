import { useCallback, useEffect, useState } from 'react';
import { requisitoService } from '../../services/requisitoService';
import { temaService } from '../../services/temaService';
import Cartao from '../../components/Cartao';
import Botao from '../../components/Botao';
import CampoTexto from '../../components/CampoTexto';
import CampoSelecao from '../../components/CampoSelecao';
import Tabela from '../../components/Tabela';
import Modal from '../../components/Modal';
import Carregamento from '../../components/Carregamento';
import MensagemErro from '../../components/MensagemErro';

const FORMULARIO_VAZIO = { texto: '', tipo: 'RF', temasIds: [] };

const TIPOS = [
  { valor: 'RF', texto: 'RF — Requisito funcional' },
  { valor: 'RNF', texto: 'RNF — Requisito não funcional' },
  { valor: 'RN', texto: 'RN — Regra de negócio' }
];

export default function Requisitos() {
  const [requisitos, definirRequisitos] = useState([]);
  const [temas, definirTemas] = useState([]);
  const [filtros, definirFiltros] = useState({ busca: '', tipo: '', temaId: '' });
  const [formulario, definirFormulario] = useState(FORMULARIO_VAZIO);
  const [emEdicao, definirEmEdicao] = useState(null);
  const [modalAberto, definirModalAberto] = useState(false);
  const [exclusao, definirExclusao] = useState(null);
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState('');

  const carregarRequisitos = useCallback(async () => {
    definirCarregando(true);
    try {
      const dados = await requisitoService.listar({ ...filtros, limite: 100 });
      definirRequisitos(dados.requisitos);
      definirErro('');
    } catch (falha) {
      definirErro(falha.message);
    } finally {
      definirCarregando(false);
    }
  }, [filtros]);

  useEffect(() => {
    temaService
      .listar()
      .then((dados) => definirTemas(dados.temas))
      .catch((falha) => definirErro(falha.message));
  }, []);

  useEffect(() => {
    const atraso = setTimeout(carregarRequisitos, 250);
    return () => clearTimeout(atraso);
  }, [carregarRequisitos]);

  function abrirCriacao() {
    definirEmEdicao(null);
    definirFormulario(FORMULARIO_VAZIO);
    definirModalAberto(true);
  }

  function abrirEdicao(requisito) {
    definirEmEdicao(requisito);
    definirFormulario({
      texto: requisito.texto,
      tipo: requisito.tipo,
      temasIds: (requisito.temas || []).map((tema) => tema.id)
    });
    definirModalAberto(true);
  }

  function alternarTema(temaId) {
    definirFormulario((atual) => ({
      ...atual,
      temasIds: atual.temasIds.includes(temaId)
        ? atual.temasIds.filter((id) => id !== temaId)
        : [...atual.temasIds, temaId]
    }));
  }

  async function salvar(evento) {
    evento.preventDefault();
    try {
      if (emEdicao) {
        await requisitoService.atualizar(emEdicao.id, formulario);
      } else {
        await requisitoService.criar(formulario);
      }
      definirModalAberto(false);
      carregarRequisitos();
    } catch (falha) {
      definirErro(falha.message);
    }
  }

  async function confirmarExclusao() {
    try {
      await requisitoService.excluir(exclusao.id);
      definirExclusao(null);
      carregarRequisitos();
    } catch (falha) {
      definirErro(falha.message);
      definirExclusao(null);
    }
  }

  const colunas = [
    {
      campo: 'tipo',
      titulo: 'Tipo',
      largura: '80px',
      conteudo: (item) => <span className="etiqueta etiqueta--tipo">{item.tipo}</span>
    },
    { campo: 'texto', titulo: 'Requisito' },
    {
      campo: 'temas',
      titulo: 'Temas',
      conteudo: (item) =>
        item.temas?.length > 0 ? item.temas.map((tema) => tema.nome).join(', ') : 'Sem tema associado'
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
          <h1>Requisitos</h1>
        </div>
        <Botao icone="fa-solid fa-plus" onClick={abrirCriacao}>
          Novo requisito
        </Botao>
      </div>

      <MensagemErro mensagem={erro} />

      <Cartao>
        <div className="filtros">
          <CampoTexto
            rotulo="Pesquisar"
            placeholder="Trecho do texto"
            value={filtros.busca}
            onChange={(evento) => definirFiltros((atual) => ({ ...atual, busca: evento.target.value }))}
          />
          <CampoSelecao
            rotulo="Tipo"
            placeholder="Todos os tipos"
            value={filtros.tipo}
            onChange={(evento) => definirFiltros((atual) => ({ ...atual, tipo: evento.target.value }))}
            opcoes={TIPOS}
          />
          <CampoSelecao
            rotulo="Tema"
            placeholder="Todos os temas"
            value={filtros.temaId}
            onChange={(evento) => definirFiltros((atual) => ({ ...atual, temaId: evento.target.value }))}
            opcoes={temas.map((tema) => ({ valor: tema.id, texto: tema.nome }))}
          />
        </div>
      </Cartao>

      <Cartao>{carregando ? <Carregamento /> : <Tabela colunas={colunas} dados={requisitos} />}</Cartao>

      <Modal
        aberto={modalAberto}
        titulo={emEdicao ? 'Editar requisito' : 'Novo requisito'}
        aoFechar={() => definirModalAberto(false)}
      >
        <form className="pilha" onSubmit={salvar}>
          <CampoTexto
            rotulo="Texto do requisito"
            multilinha
            value={formulario.texto}
            onChange={(evento) => definirFormulario((atual) => ({ ...atual, texto: evento.target.value }))}
            required
          />
          <CampoSelecao
            rotulo="Classificação"
            value={formulario.tipo}
            onChange={(evento) => definirFormulario((atual) => ({ ...atual, tipo: evento.target.value }))}
            opcoes={TIPOS}
          />

          <fieldset className="conjunto-campos">
            <legend>Temas associados</legend>
            <p className="texto-secundario">Um requisito pode pertencer a mais de um tema.</p>
            <ul className="lista-associacao">
              {temas.map((tema) => (
                <li key={tema.id}>
                  <label className="alternador">
                    <input
                      type="checkbox"
                      checked={formulario.temasIds.includes(tema.id)}
                      onChange={() => alternarTema(tema.id)}
                    />
                    <span>{tema.nome}</span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>

          <Botao type="submit" icone="fa-solid fa-floppy-disk">
            Salvar requisito
          </Botao>
        </form>
      </Modal>

      <Modal
        aberto={Boolean(exclusao)}
        titulo="Excluir requisito"
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
        <p>Requisitos já usados em partidas não podem ser excluídos, para preservar o histórico dos jogadores.</p>
      </Modal>
    </div>
  );
}
