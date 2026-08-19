import { useCallback, useEffect, useState } from 'react';
import { temaService } from '../../services/temaService';
import { requisitoService } from '../../services/requisitoService';
import Cartao from '../../components/Cartao';
import Botao from '../../components/Botao';
import CampoTexto from '../../components/CampoTexto';
import CampoSelecao from '../../components/CampoSelecao';
import Tabela from '../../components/Tabela';
import Modal from '../../components/Modal';
import Carregamento from '../../components/Carregamento';
import MensagemErro from '../../components/MensagemErro';

const FORMULARIO_VAZIO = { nome: '', descricao: '', ativo: true };

export default function Temas() {
  const [temas, definirTemas] = useState([]);
  const [filtros, definirFiltros] = useState({ busca: '', ativo: '' });
  const [formulario, definirFormulario] = useState(FORMULARIO_VAZIO);
  const [emEdicao, definirEmEdicao] = useState(null);
  const [modalAberto, definirModalAberto] = useState(false);
  const [exclusao, definirExclusao] = useState(null);
  const [associacao, definirAssociacao] = useState(null);
  const [requisitos, definirRequisitos] = useState([]);
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState('');

  const carregarTemas = useCallback(async () => {
    definirCarregando(true);
    try {
      const dados = await temaService.listar({ ...filtros, comRequisitos: 'true' });
      definirTemas(dados.temas);
      definirErro('');
    } catch (falha) {
      definirErro(falha.message);
    } finally {
      definirCarregando(false);
    }
  }, [filtros]);

  useEffect(() => {
    const atraso = setTimeout(carregarTemas, 250);
    return () => clearTimeout(atraso);
  }, [carregarTemas]);

  function abrirCriacao() {
    definirEmEdicao(null);
    definirFormulario(FORMULARIO_VAZIO);
    definirModalAberto(true);
  }

  function abrirEdicao(tema) {
    definirEmEdicao(tema);
    definirFormulario({ nome: tema.nome, descricao: tema.descricao || '', ativo: tema.ativo });
    definirModalAberto(true);
  }

  async function salvar(evento) {
    evento.preventDefault();
    try {
      if (emEdicao) {
        await temaService.atualizar(emEdicao.id, formulario);
      } else {
        await temaService.criar(formulario);
      }
      definirModalAberto(false);
      carregarTemas();
    } catch (falha) {
      definirErro(falha.message);
    }
  }

  async function alternarSituacao(tema) {
    try {
      await temaService.alterarSituacao(tema.id, !tema.ativo);
      carregarTemas();
    } catch (falha) {
      definirErro(falha.message);
    }
  }

  async function confirmarExclusao() {
    try {
      await temaService.excluir(exclusao.id);
      definirExclusao(null);
      carregarTemas();
    } catch (falha) {
      definirErro(falha.message);
      definirExclusao(null);
    }
  }

  async function abrirAssociacao(tema) {
    try {
      const [detalhes, listaRequisitos] = await Promise.all([
        temaService.buscarPorId(tema.id),
        requisitoService.listar({ limite: 100 })
      ]);
      definirAssociacao(detalhes.tema);
      definirRequisitos(listaRequisitos.requisitos);
    } catch (falha) {
      definirErro(falha.message);
    }
  }

  async function alternarAssociacao(requisitoId, jaAssociado) {
    try {
      if (jaAssociado) {
        await temaService.removerAssociacao(associacao.id, requisitoId);
      } else {
        await temaService.associarRequisitos(associacao.id, [requisitoId]);
      }
      const detalhes = await temaService.buscarPorId(associacao.id);
      definirAssociacao(detalhes.tema);
      carregarTemas();
    } catch (falha) {
      definirErro(falha.message);
    }
  }

  const colunas = [
    { campo: 'nome', titulo: 'Tema' },
    {
      campo: 'requisitos',
      titulo: 'Requisitos',
      largura: '120px',
      conteudo: (item) => item.requisitos?.length ?? 0
    },
    {
      campo: 'ativo',
      titulo: 'Situacao',
      largura: '120px',
      conteudo: (item) => (
        <span className={`etiqueta etiqueta--${item.ativo ? 'sucesso' : 'neutra'}`}>
          {item.ativo ? 'Ativo' : 'Inativo'}
        </span>
      )
    },
    {
      campo: 'acoes',
      titulo: 'Acoes',
      conteudo: (item) => (
        <div className="linha">
          <Botao variante="texto" tamanho="pequeno" icone="fa-solid fa-link" onClick={() => abrirAssociacao(item)}>
            Requisitos
          </Botao>
          <Botao variante="texto" tamanho="pequeno" icone="fa-solid fa-pen" onClick={() => abrirEdicao(item)}>
            Editar
          </Botao>
          <Botao
            variante="texto"
            tamanho="pequeno"
            icone={item.ativo ? 'fa-solid fa-toggle-on' : 'fa-solid fa-toggle-off'}
            onClick={() => alternarSituacao(item)}
          >
            {item.ativo ? 'Desativar' : 'Ativar'}
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

  const idsAssociados = new Set((associacao?.requisitos || []).map((requisito) => requisito.id));

  return (
    <div className="pilha" style={{ gap: 'var(--espaco-6)' }}>
      <div className="cabecalho-pagina">
        <div>
          <span className="rotulo-secao">Administracao</span>
          <h1>Temas</h1>
        </div>
        <Botao icone="fa-solid fa-plus" onClick={abrirCriacao}>
          Novo tema
        </Botao>
      </div>

      <MensagemErro mensagem={erro} />

      <Cartao>
        <div className="filtros">
          <CampoTexto
            rotulo="Pesquisar"
            placeholder="Nome ou descricao"
            value={filtros.busca}
            onChange={(evento) => definirFiltros((atual) => ({ ...atual, busca: evento.target.value }))}
          />
          <CampoSelecao
            rotulo="Situacao"
            placeholder="Todas"
            value={filtros.ativo}
            onChange={(evento) => definirFiltros((atual) => ({ ...atual, ativo: evento.target.value }))}
            opcoes={[
              { valor: 'true', texto: 'Ativos' },
              { valor: 'false', texto: 'Inativos' }
            ]}
          />
        </div>
      </Cartao>

      <Cartao>{carregando ? <Carregamento /> : <Tabela colunas={colunas} dados={temas} />}</Cartao>

      <Modal
        aberto={modalAberto}
        titulo={emEdicao ? 'Editar tema' : 'Novo tema'}
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
            rotulo="Descricao"
            multilinha
            value={formulario.descricao}
            onChange={(evento) => definirFormulario((atual) => ({ ...atual, descricao: evento.target.value }))}
          />
          <label className="alternador">
            <input
              type="checkbox"
              checked={formulario.ativo}
              onChange={(evento) => definirFormulario((atual) => ({ ...atual, ativo: evento.target.checked }))}
            />
            <span>Tema disponivel para os jogadores</span>
          </label>
          <Botao type="submit" icone="fa-solid fa-floppy-disk">
            Salvar tema
          </Botao>
        </form>
      </Modal>

      <Modal
        aberto={Boolean(associacao)}
        titulo={`Requisitos de ${associacao?.nome || ''}`}
        aoFechar={() => definirAssociacao(null)}
        rodape={
          <Botao variante="secundario" onClick={() => definirAssociacao(null)}>
            Concluir
          </Botao>
        }
      >
        <p className="texto-secundario">
          Um tema precisa de pelo menos 7 requisitos associados para gerar partidas.
        </p>
        <ul className="lista-associacao">
          {requisitos.map((requisito) => {
            const associado = idsAssociados.has(requisito.id);
            return (
              <li key={requisito.id}>
                <label className="alternador">
                  <input
                    type="checkbox"
                    checked={associado}
                    onChange={() => alternarAssociacao(requisito.id, associado)}
                  />
                  <span>
                    <span className={`etiqueta etiqueta--tipo`}>{requisito.tipo}</span> {requisito.texto}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </Modal>

      <Modal
        aberto={Boolean(exclusao)}
        titulo="Excluir tema"
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
          O tema <strong>{exclusao?.nome}</strong> sera removido junto com suas associacoes. Temas com partidas
          registradas nao podem ser excluidos, apenas desativados.
        </p>
      </Modal>
    </div>
  );
}
