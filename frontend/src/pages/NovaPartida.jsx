import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { temaService } from '../services/temaService';
import { dificuldadeService } from '../services/dificuldadeService';
import { partidaService } from '../services/partidaService';
import Botao from '../components/Botao';
import PixelCard from '../components/PixelCard';
import Carregamento from '../components/Carregamento';
import MensagemErro from '../components/MensagemErro';
import EstadoVazio from '../components/EstadoVazio';

export default function NovaPartida() {
  const navegar = useNavigate();

  const [temas, definirTemas] = useState([]);
  const [dificuldades, definirDificuldades] = useState([]);
  const [temaSelecionado, definirTemaSelecionado] = useState(null);
  const [dificuldadeSelecionada, definirDificuldadeSelecionada] = useState(null);
  const [carregando, definirCarregando] = useState(true);
  const [iniciando, definirIniciando] = useState(false);
  const [erro, definirErro] = useState('');

  useEffect(() => {
    async function carregarOpcoes() {
      try {
        const [dadosTemas, dadosDificuldades] = await Promise.all([
          temaService.listarDisponiveis(),
          dificuldadeService.listar({ apenasAtivas: true })
        ]);
        definirTemas(dadosTemas.temas);
        definirDificuldades(dadosDificuldades.dificuldades);
      } catch (falha) {
        definirErro(falha.message);
      } finally {
        definirCarregando(false);
      }
    }

    carregarOpcoes();
  }, []);

  async function iniciarPartida() {
    definirErro('');
    definirIniciando(true);

    try {
      const dados = await partidaService.iniciarPartida(temaSelecionado, dificuldadeSelecionada);
      navegar(`/partidas/${dados.partida.id}`);
    } catch (falha) {
      definirErro(falha.message);
      definirIniciando(false);
    }
  }

  if (carregando) return <Carregamento mensagem="Carregando temas e dificuldades..." />;

  const etapa2Liberada = Boolean(temaSelecionado);
  const prontoParaComecar = Boolean(temaSelecionado) && Boolean(dificuldadeSelecionada);

  return (
    <div className="preparacao">
      <header className="preparacao__cabecalho">
        <span className="rotulo-secao">Preparar partida</span>
        <h1>Monte sua rodada</h1>
        <p className="texto-secundario">Duas escolhas rapidas e voce entra direto no jogo.</p>
      </header>

      <MensagemErro mensagem={erro} />

      <section className="preparacao__etapa">
        <div className="preparacao__etapa-titulo">
          <span className="preparacao__numero">1</span>
          <h2>Escolha o tema</h2>
        </div>

        {temas.length === 0 ? (
          <EstadoVazio
            icone="fa-solid fa-layer-group"
            titulo="Nenhum tema disponivel"
            descricao="Peca a um administrador para cadastrar e ativar temas."
          />
        ) : (
          <div className="grade grade-fixa-2">
            {temas.map((tema) => (
              <PixelCard
                as="button"
                key={tema.id}
                type="button"
                variante={temaSelecionado === tema.id ? 'dourado' : 'padrao'}
                gap={8}
                className={`selecao ${temaSelecionado === tema.id ? 'selecao--ativa' : ''}`}
                onClick={() => definirTemaSelecionado(tema.id)}
                aria-pressed={temaSelecionado === tema.id}
              >
                <strong>{tema.nome}</strong>
                <span className="texto-secundario">{tema.descricao}</span>
                {temaSelecionado === tema.id && (
                  <span className="selecao__marca">
                    <i className="fa-solid fa-check" aria-hidden="true" /> Selecionado
                  </span>
                )}
              </PixelCard>
            ))}
          </div>
        )}
      </section>

      <section className={`preparacao__etapa ${!etapa2Liberada ? 'preparacao__etapa--bloqueada' : ''}`}>
        <div className="preparacao__etapa-titulo">
          <span className="preparacao__numero">2</span>
          <h2>Escolha a dificuldade</h2>
        </div>

        {!etapa2Liberada ? (
          <p className="texto-secundario">Selecione um tema para liberar os niveis de dificuldade.</p>
        ) : (
          <div className="grade grade-fixa-2">
            {dificuldades.map((dificuldade) => (
              <PixelCard
                as="button"
                key={dificuldade.id}
                type="button"
                variante={dificuldadeSelecionada === dificuldade.id ? 'dourado' : 'padrao'}
                gap={8}
                className={`selecao selecao--compacta ${
                  dificuldadeSelecionada === dificuldade.id ? 'selecao--ativa' : ''
                }`}
                onClick={() => definirDificuldadeSelecionada(dificuldade.id)}
                aria-pressed={dificuldadeSelecionada === dificuldade.id}
              >
                <strong>{dificuldade.nome}</strong>
                <span className="texto-secundario">
                  {dificuldade.tempo}s no relogio · {dificuldade.pontos} pontos por acerto
                </span>
                {dificuldadeSelecionada === dificuldade.id && (
                  <span className="selecao__marca">
                    <i className="fa-solid fa-check" aria-hidden="true" /> Selecionada
                  </span>
                )}
              </PixelCard>
            ))}
          </div>
        )}
      </section>

      <footer className="preparacao__rodape">
        <Botao
          tamanho="grande"
          icone="fa-solid fa-play"
          carregando={iniciando}
          disabled={!prontoParaComecar}
          onClick={iniciarPartida}
        >
          Comecar partida
        </Botao>
        {!prontoParaComecar && (
          <span className="texto-secundario">Selecione um tema e uma dificuldade para liberar o botao.</span>
        )}
      </footer>
    </div>
  );
}
