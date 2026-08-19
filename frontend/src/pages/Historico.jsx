import { useCallback, useEffect, useState } from 'react';
import { historicoService } from '../services/historicoService';
import { temaService } from '../services/temaService';
import { dificuldadeService } from '../services/dificuldadeService';
import { descreverAlternativa } from '../components/alternativas';
import Cartao from '../components/Cartao';
import CampoSelecao from '../components/CampoSelecao';
import Botao from '../components/Botao';
import Modal from '../components/Modal';
import Tabela from '../components/Tabela';
import Carregamento from '../components/Carregamento';
import MensagemErro from '../components/MensagemErro';
import EstadoVazio from '../components/EstadoVazio';

function formatarData(valor) {
  return new Date(valor).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

export default function Historico() {
  const [partidas, definirPartidas] = useState([]);
  const [temas, definirTemas] = useState([]);
  const [dificuldades, definirDificuldades] = useState([]);
  const [filtros, definirFiltros] = useState({ temaId: '', dificuldadeId: '' });
  const [detalhes, definirDetalhes] = useState(null);
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState('');

  const carregarHistorico = useCallback(async () => {
    definirCarregando(true);
    try {
      const dados = await historicoService.buscarHistorico(filtros);
      definirPartidas(dados.partidas);
    } catch (falha) {
      definirErro(falha.message);
    } finally {
      definirCarregando(false);
    }
  }, [filtros]);

  useEffect(() => {
    async function carregarFiltros() {
      const [dadosTemas, dadosDificuldades] = await Promise.all([
        temaService.listarDisponiveis(),
        dificuldadeService.listar()
      ]);
      definirTemas(dadosTemas.temas);
      definirDificuldades(dadosDificuldades.dificuldades);
    }

    carregarFiltros().catch((falha) => definirErro(falha.message));
  }, []);

  useEffect(() => {
    carregarHistorico();
  }, [carregarHistorico]);

  async function abrirDetalhes(partidaId) {
    try {
      definirDetalhes(await historicoService.buscarDetalhesDaPartida(partidaId));
    } catch (falha) {
      definirErro(falha.message);
    }
  }

  const colunas = [
    { campo: 'finalizadaEm', titulo: 'Data', conteudo: (item) => formatarData(item.finalizadaEm) },
    { campo: 'tema', titulo: 'Tema', conteudo: (item) => item.tema?.nome },
    { campo: 'dificuldade', titulo: 'Dificuldade', conteudo: (item) => item.dificuldade?.nome },
    { campo: 'acertos', titulo: 'Acertos', conteudo: (item) => `${item.acertos} de 10` },
    { campo: 'pontuacao', titulo: 'Pontos' },
    { campo: 'tempoTotal', titulo: 'Tempo', conteudo: (item) => `${item.tempoTotal ?? 0}s` },
    {
      campo: 'acoes',
      titulo: 'Revisao',
      conteudo: (item) => (
        <Botao variante="texto" tamanho="pequeno" icone="fa-solid fa-eye" onClick={() => abrirDetalhes(item.id)}>
          Abrir
        </Botao>
      )
    }
  ];

  return (
    <div className="pilha" style={{ gap: 'var(--espaco-6)' }}>
      <div>
        <span className="rotulo-secao">Seu desempenho</span>
        <h1>Historico de partidas</h1>
      </div>

      <MensagemErro mensagem={erro} />

      <Cartao>
        <div className="filtros">
          <CampoSelecao
            rotulo="Tema"
            placeholder="Todos os temas"
            value={filtros.temaId}
            onChange={(evento) => definirFiltros((atual) => ({ ...atual, temaId: evento.target.value }))}
            opcoes={temas.map((tema) => ({ valor: tema.id, texto: tema.nome }))}
          />
          <CampoSelecao
            rotulo="Dificuldade"
            placeholder="Todas as dificuldades"
            value={filtros.dificuldadeId}
            onChange={(evento) => definirFiltros((atual) => ({ ...atual, dificuldadeId: evento.target.value }))}
            opcoes={dificuldades.map((dificuldade) => ({ valor: dificuldade.id, texto: dificuldade.nome }))}
          />
        </div>
      </Cartao>

      {carregando ? (
        <Carregamento />
      ) : partidas.length === 0 ? (
        <EstadoVazio
          icone="fa-solid fa-clock-rotate-left"
          titulo="Nenhuma partida por aqui"
          descricao="Jogue uma rodada e ela aparece nesta lista."
        />
      ) : (
        <Cartao>
          <Tabela colunas={colunas} dados={partidas} />
        </Cartao>
      )}

      <Modal
        aberto={Boolean(detalhes)}
        titulo="Revisao da partida"
        aoFechar={() => definirDetalhes(null)}
        rodape={
          <Botao variante="secundario" onClick={() => definirDetalhes(null)}>
            Fechar
          </Botao>
        }
      >
        {detalhes && (
          <ul className="revisao">
            {detalhes.revisao.map((item) => (
              <li key={item.ordem} className={`revisao__item ${item.correta ? 'revisao__item--correta' : ''}`}>
                <i
                  className={item.correta ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'}
                  aria-hidden="true"
                />
                <div>
                  <p className="revisao__requisito">{item.requisito}</p>
                  <p className="texto-secundario">
                    Sua resposta: <strong>{descreverAlternativa(item.respostaEscolhida)}</strong> · Correta:{' '}
                    <strong>{descreverAlternativa(item.respostaCorreta)}</strong>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
}
