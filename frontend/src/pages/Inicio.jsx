import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usarAutenticacao } from '../contexts/AutenticacaoContexto';
import { historicoService } from '../services/historicoService';
import Cartao from '../components/Cartao';
import PixelCard from '../components/PixelCard';
import Botao from '../components/Botao';
import Carregamento from '../components/Carregamento';
import MensagemErro from '../components/MensagemErro';

const REGRAS = [
  { icone: 'fa-solid fa-list-ol', texto: 'Cada rodada traz 10 requisitos sorteados pelo servidor.' },
  { icone: 'fa-solid fa-ban', texto: 'Alguns requisitos são de outros temas: marque "não condiz com o tema".' },
  { icone: 'fa-solid fa-stopwatch', texto: 'O tempo corre no servidor. Quando acaba, a partida encerra.' },
  { icone: 'fa-solid fa-star', texto: 'Cada acerto vale os pontos da dificuldade escolhida.' }
];

export default function Inicio() {
  const { usuario } = usarAutenticacao();
  const [resumo, definirResumo] = useState(null);
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState('');

  useEffect(() => {
    async function carregarResumo() {
      try {
        const dados = await historicoService.buscarResumo();
        definirResumo(dados.resumo);
      } catch (falha) {
        definirErro(falha.message);
      } finally {
        definirCarregando(false);
      }
    }

    carregarResumo();
  }, []);

  return (
    <div className="hub">
      <div className="hub__principal">
        <PixelCard as="section" variante="dourado" gap={9} velocidade={40} className="chamada">
          <span className="rotulo-secao">Seu hub de jogador</span>
          <h1>{usuario?.nome?.split(' ')[0]}, pronto para mais uma rodada?</h1>
          <p className="texto-secundario">
            Escolha um tema, defina o nível de pressão no relógio e classifique dez requisitos.
          </p>
          <div className="linha" style={{ marginTop: 'var(--espaco-6)' }}>
            <Link to="/partidas/nova">
              <Botao icone="fa-solid fa-play" tamanho="grande">
                Jogar agora
              </Botao>
            </Link>
            <Link to="/ranking">
              <Botao variante="secundario" icone="fa-solid fa-trophy">
                Ver ranking
              </Botao>
            </Link>
            <Link to="/historico">
              <Botao variante="secundario" icone="fa-solid fa-clock-rotate-left">
                Ver histórico
              </Botao>
            </Link>
          </div>
        </PixelCard>

        <MensagemErro mensagem={erro} />

        <Cartao titulo="Como funciona a rodada">
          <ul className="lista-regras">
            {REGRAS.map((regra) => (
              <li key={regra.texto}>
                <i className={regra.icone} aria-hidden="true" />
                <span>{regra.texto}</span>
              </li>
            ))}
          </ul>
        </Cartao>
      </div>

      <aside className="hub__estatisticas">
        <Cartao titulo="Seu desempenho" className="hub__cartao-estatisticas">
          {carregando ? (
            <Carregamento mensagem="Carregando..." />
          ) : (
            resumo && (
              <div className="pilha-estatisticas">
                <div className="indicador">
                  <span className="indicador__rotulo">Partidas concluídas</span>
                  <strong className="indicador__valor">{resumo.totalPartidas}</strong>
                </div>
                <div className="indicador">
                  <span className="indicador__rotulo">Melhor pontuação</span>
                  <strong className="indicador__valor">{resumo.melhorPontuacao}</strong>
                </div>
                <div className="indicador">
                  <span className="indicador__rotulo">Aproveitamento</span>
                  <strong className="indicador__valor">{resumo.aproveitamento}%</strong>
                </div>
              </div>
            )
          )}
        </Cartao>

        <Cartao titulo="Continue evoluindo" className="hub__cartao-atalhos">
          <div className="pilha" style={{ gap: 'var(--espaco-3)' }}>
            <Link to="/historico" className="menu__item menu__item--hub">
              <i className="fa-solid fa-clock-rotate-left" aria-hidden="true" />
              <span>Rever seu histórico</span>
            </Link>
            <Link to="/ranking" className="menu__item menu__item--hub">
              <i className="fa-solid fa-trophy" aria-hidden="true" />
              <span>Conferir o ranking</span>
            </Link>
          </div>
        </Cartao>
      </aside>
    </div>
  );
}
