/**
 * Exibicao visual do tempo. A contagem oficial e sempre do servidor:
 * este componente apenas apresenta o valor recebido.
 */
function definirEstado(segundosRestantes, tempoTotal) {
  const proporcao = tempoTotal > 0 ? segundosRestantes / tempoTotal : 0;

  if (proporcao <= 0.15) return 'critico';
  if (proporcao <= 0.35) return 'atencao';
  return 'normal';
}

const DESCRICAO_ESTADO = {
  normal: 'Tempo confortável',
  atencao: 'Tempo acabando',
  critico: 'Tempo quase no fim'
};

const ICONE_ESTADO = {
  normal: 'fa-solid fa-stopwatch',
  atencao: 'fa-solid fa-hourglass-half',
  critico: 'fa-solid fa-triangle-exclamation'
};

export default function Cronometro({ segundosRestantes = 0, tempoTotal = 0 }) {
  const estado = definirEstado(segundosRestantes, tempoTotal);
  const minutos = Math.floor(segundosRestantes / 60);
  const segundos = segundosRestantes % 60;

  return (
    <div className={`cronometro cronometro--${estado}`}>
      <i className={ICONE_ESTADO[estado]} aria-hidden="true" />
      <div>
        <span className="cronometro__rotulo">Tempo</span>
        <strong className="cronometro__valor" aria-live="off">
          {String(minutos).padStart(2, '0')}:{String(segundos).padStart(2, '0')}
        </strong>
      </div>
      <span className="acesso-teclado">{DESCRICAO_ESTADO[estado]}</span>
    </div>
  );
}
