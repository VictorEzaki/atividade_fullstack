import { useCallback, useEffect, useState } from 'react';
import { rankingService } from '../services/rankingService';
import { temaService } from '../services/temaService';
import { dificuldadeService } from '../services/dificuldadeService';
import { usarAutenticacao } from '../contexts/AutenticacaoContexto';
import Cartao from '../components/Cartao';
import CampoSelecao from '../components/CampoSelecao';
import Carregamento from '../components/Carregamento';
import MensagemErro from '../components/MensagemErro';
import EstadoVazio from '../components/EstadoVazio';

export default function Ranking() {
  const { usuario } = usarAutenticacao();

  const [ranking, definirRanking] = useState([]);
  const [temas, definirTemas] = useState([]);
  const [dificuldades, definirDificuldades] = useState([]);
  const [filtros, definirFiltros] = useState({ temaId: '', dificuldadeId: '' });
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState('');

  const carregarRanking = useCallback(async () => {
    definirCarregando(true);
    try {
      const dados = await rankingService.listarRanking(filtros);
      definirRanking(dados.ranking);
    } catch (falha) {
      definirErro(falha.message);
    } finally {
      definirCarregando(false);
    }
  }, [filtros]);

  useEffect(() => {
    Promise.all([temaService.listarDisponiveis(), dificuldadeService.listar()])
      .then(([dadosTemas, dadosDificuldades]) => {
        definirTemas(dadosTemas.temas);
        definirDificuldades(dadosDificuldades.dificuldades);
      })
      .catch((falha) => definirErro(falha.message));
  }, []);

  useEffect(() => {
    carregarRanking();
  }, [carregarRanking]);

  return (
    <div className="pilha" style={{ gap: 'var(--espaco-6)' }}>
      <div>
        <span className="rotulo-secao">Competição</span>
        <h1>Ranking</h1>
        <p className="texto-secundario">
          Vale a melhor partida de cada jogador. Empate na pontuação? Ganha quem terminou em menos tempo.
        </p>
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
      ) : ranking.length === 0 ? (
        <EstadoVazio
          icone="fa-solid fa-trophy"
          titulo="Ranking ainda vazio"
          descricao="Seja o primeiro a concluir uma partida com esse filtro."
        />
      ) : (
        <ol className="ranking">
          {ranking.map((linha) => (
            <li
              key={`${linha.usuario.id}-${linha.posicao}`}
              className={`ranking__linha ${linha.usuario.id === usuario?.id ? 'ranking__linha--voce' : ''}`}
            >
              <span className="ranking__posicao">{linha.posicao}</span>
              <div className="ranking__jogador">
                <strong>{linha.usuario.nome}</strong>
                <span className="texto-secundario">
                  {linha.tema?.nome} · {linha.dificuldade?.nome}
                </span>
              </div>
              <div className="ranking__numeros">
                <strong>{linha.pontuacao} pts</strong>
                <span className="texto-secundario">{linha.tempoTotal ?? 0}s</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
