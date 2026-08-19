import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { partidaService } from '../services/partidaService';
import { ALTERNATIVAS } from '../components/alternativas';
import Cronometro from '../components/Cronometro';
import Placar from '../components/Placar';
import IndicadorProgresso from '../components/IndicadorProgresso';
import CartaoRequisito from '../components/CartaoRequisito';
import OpcaoResposta from '../components/OpcaoResposta';
import MensagemFeedback from '../components/MensagemFeedback';
import Carregamento from '../components/Carregamento';
import MensagemErro from '../components/MensagemErro';
import { tocarSomAcerto, tocarSomErro } from '../utils/efeitosSonoros';

const DURACAO_FEEDBACK = 1400;

export default function Jogo() {
  const { partidaId } = useParams();
  const navegar = useNavigate();

  const [partida, definirPartida] = useState(null);
  const [questao, definirQuestao] = useState(null);
  const [segundosRestantes, definirSegundosRestantes] = useState(0);
  const [feedback, definirFeedback] = useState(null);
  const [enviando, definirEnviando] = useState(false);
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState('');

  const encerrandoRef = useRef(false);

  const irParaResultado = useCallback(() => {
    navegar(`/partidas/${partidaId}/resultado`, { replace: true });
  }, [navegar, partidaId]);

  const sincronizarEstado = useCallback(async () => {
    try {
      const dados = await partidaService.buscarEstado(partidaId);

      if (dados.finalizada) {
        irParaResultado();
        return;
      }

      definirPartida(dados.partida);
      definirQuestao(dados.questao);
      definirSegundosRestantes(dados.questao.tempoRestante);
    } catch (falha) {
      definirErro(falha.message);
    } finally {
      definirCarregando(false);
    }
  }, [partidaId, irParaResultado]);

  useEffect(() => {
    sincronizarEstado();
  }, [sincronizarEstado]);

  /* Contagem apenas visual: a validacao oficial do tempo acontece no servidor. */
  useEffect(() => {
    if (carregando || !questao) return undefined;

    const intervalo = setInterval(() => {
      definirSegundosRestantes((atual) => Math.max(0, atual - 1));
    }, 1000);

    return () => clearInterval(intervalo);
  }, [carregando, questao]);

  useEffect(() => {
    if (segundosRestantes > 0 || carregando || encerrandoRef.current || !questao) return;

    encerrandoRef.current = true;
    partidaService.finalizarPartida(partidaId).finally(irParaResultado);
  }, [segundosRestantes, carregando, questao, partidaId, irParaResultado]);

  const responder = useCallback(
    async (alternativa) => {
      if (enviando || feedback || !questao) return;

      definirEnviando(true);
      const pontuacaoAnterior = partida?.pontuacao ?? 0;

      try {
        const dados = await partidaService.responderRequisito(partidaId, questao.ordem, alternativa);

        if (dados.tempoEsgotado) {
          encerrandoRef.current = true;
          irParaResultado();
          return;
        }

        definirFeedback({
          correta: dados.correta,
          respostaCorreta: dados.respostaCorreta,
          respostaEscolhida: dados.respostaEscolhida,
          pontuacaoGanha: dados.pontuacao - pontuacaoAnterior
        });

        if (dados.correta) {
          tocarSomAcerto();
        } else {
          tocarSomErro();
        }
        definirPartida((atual) => ({ ...atual, pontuacao: dados.pontuacao, respondidas: dados.respondidas }));
        definirSegundosRestantes(dados.tempoRestante);

        setTimeout(() => {
          definirFeedback(null);
          if (dados.finalizada) {
            encerrandoRef.current = true;
            irParaResultado();
          } else {
            sincronizarEstado();
          }
        }, DURACAO_FEEDBACK);
      } catch (falha) {
        definirErro(falha.message);
      } finally {
        definirEnviando(false);
      }
    },
    [enviando, feedback, questao, partida, partidaId, irParaResultado, sincronizarEstado]
  );

  /* Atalhos de teclado: 1 a 4 ou A a D. */
  useEffect(() => {
    function aoPressionarTecla(evento) {
      const indicePorNumero = Number(evento.key) - 1;
      const indicePorLetra = ALTERNATIVAS.findIndex(
        (alternativa) => alternativa.atalho === evento.key.toUpperCase()
      );
      const indice = ALTERNATIVAS[indicePorNumero] ? indicePorNumero : indicePorLetra;

      if (indice >= 0) {
        responder(ALTERNATIVAS[indice].valor);
      }
    }

    document.addEventListener('keydown', aoPressionarTecla);
    return () => document.removeEventListener('keydown', aoPressionarTecla);
  }, [responder]);

  if (carregando) return <Carregamento mensagem="Preparando sua partida..." />;
  if (erro) return <MensagemErro mensagem={erro} aoTentarNovamente={sincronizarEstado} />;
  if (!questao || !partida) return null;

  function definirEstadoDaOpcao(alternativa) {
    if (!feedback) return 'neutro';
    if (feedback.respostaCorreta === alternativa.valor) return 'correta';
    if (feedback.respostaEscolhida === alternativa.valor) return 'incorreta';
    return 'neutro';
  }

  return (
    <div className="jogo">
      <header className="jogo__topo">
        <span className="marca marca--clara">
          <span className="marca__simbolo" aria-hidden="true">
            RF
          </span>
          <span className="marca__nome">Classifica</span>
        </span>
      </header>

      <div className="jogo__hud">
        <IndicadorProgresso atual={questao.ordem} total={questao.total} rotulo="Requisito" />
        <Cronometro segundosRestantes={segundosRestantes} tempoTotal={partida.dificuldade.tempo} />
        <Placar pontuacao={partida.pontuacao} />
      </div>

      <div className="jogo__corpo">
        <CartaoRequisito texto={questao.requisito.texto} tema={partida.tema.nome} />

        <MensagemFeedback feedback={feedback} />

        <div className="jogo__opcoes">
          {ALTERNATIVAS.map((alternativa) => (
            <OpcaoResposta
              key={alternativa.valor}
              alternativa={alternativa}
              estado={definirEstadoDaOpcao(alternativa)}
              desabilitada={enviando || Boolean(feedback)}
              aoEscolher={responder}
            />
          ))}
        </div>

        <p className="texto-secundario jogo__dica">
          Dica: use as teclas 1 a 4 (ou A a D) para responder mais rapido.
        </p>
      </div>
    </div>
  );
}
