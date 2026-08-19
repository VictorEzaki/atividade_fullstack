import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { partidaService } from '../services/partidaService';
import { descreverAlternativa } from '../components/alternativas';
import Cartao from '../components/Cartao';
import Botao from '../components/Botao';
import Carregamento from '../components/Carregamento';
import MensagemErro from '../components/MensagemErro';

export default function Resultado() {
  const { partidaId } = useParams();
  const [resultado, definirResultado] = useState(null);
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState('');

  useEffect(() => {
    async function carregarResultado() {
      try {
        definirResultado(await partidaService.buscarResultado(partidaId));
      } catch (falha) {
        definirErro(falha.message);
      } finally {
        definirCarregando(false);
      }
    }

    carregarResultado();
  }, [partidaId]);

  if (carregando) return <Carregamento mensagem="Calculando seu resultado..." />;
  if (erro) return <MensagemErro mensagem={erro} />;
  if (!resultado) return null;

  const erradas = resultado.revisao.filter((item) => !item.correta);

  return (
    <div className="pilha" style={{ gap: 'var(--espaco-8)' }}>
      <section className="resultado">
        <span className="rotulo-secao">Partida encerrada</span>
        <h1>
          {resultado.acertos} de {resultado.total} classificacoes corretas
        </h1>
        <p className="resultado__pontuacao">
          {resultado.pontuacao} <span>pontos</span>
        </p>
        <p className="texto-secundario">
          Tema {resultado.tema?.nome} · Dificuldade {resultado.dificuldade?.nome} · {resultado.tempoTotal}s de
          jogo
          {resultado.naoRespondidas > 0 && ` · ${resultado.naoRespondidas} sem resposta`}
        </p>
        <div className="linha" style={{ marginTop: 'var(--espaco-6)' }}>
          <Link to="/partidas/nova">
            <Botao icone="fa-solid fa-rotate-right">Jogar de novo</Botao>
          </Link>
          <Link to="/ranking">
            <Botao variante="secundario" icone="fa-solid fa-trophy">
              Ver ranking
            </Botao>
          </Link>
        </div>
      </section>

      <Cartao
        titulo={erradas.length > 0 ? `Revise os ${erradas.length} erros` : 'Revisao completa da rodada'}
        descricao={
          erradas.length > 0
            ? 'Compare o que voce marcou com a classificacao correta.'
            : 'Rodada perfeita. Aqui esta tudo o que apareceu.'
        }
      >
        <ul className="revisao">
          {(erradas.length > 0 ? erradas : resultado.revisao).map((item) => (
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
      </Cartao>
    </div>
  );
}
