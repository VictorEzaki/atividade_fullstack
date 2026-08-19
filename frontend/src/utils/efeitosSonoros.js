/**
 * Efeitos sonoros do jogo, sintetizados em tempo real com a Web Audio API.
 * Evita depender de arquivos de audio externos: os sons sao gerados por
 * osciladores simples, com fallback silencioso em ambientes sem suporte.
 */

let contextoAudio;

function obterContexto() {
  const AudioContextClasse = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClasse) return null;

  if (!contextoAudio) {
    contextoAudio = new AudioContextClasse();
  }
  if (contextoAudio.state === 'suspended') {
    contextoAudio.resume();
  }
  return contextoAudio;
}

function tocarTom(contexto, { frequencia, duracao, atraso = 0, tipo = 'sine', volume = 0.2 }) {
  const osc = contexto.createOscillator();
  const ganho = contexto.createGain();

  osc.type = tipo;
  osc.frequency.setValueAtTime(frequencia, contexto.currentTime + atraso);

  ganho.gain.setValueAtTime(0, contexto.currentTime + atraso);
  ganho.gain.linearRampToValueAtTime(volume, contexto.currentTime + atraso + 0.015);
  ganho.gain.exponentialRampToValueAtTime(0.001, contexto.currentTime + atraso + duracao);

  osc.connect(ganho);
  ganho.connect(contexto.destination);

  osc.start(contexto.currentTime + atraso);
  osc.stop(contexto.currentTime + atraso + duracao + 0.05);
}

/** Pequeno arpejo ascendente e alegre, tocado quando o jogador acerta. */
export function tocarSomAcerto() {
  const contexto = obterContexto();
  if (!contexto) return;

  try {
    tocarTom(contexto, { frequencia: 523.25, duracao: 0.13, atraso: 0, tipo: 'triangle', volume: 0.22 });
    tocarTom(contexto, { frequencia: 659.25, duracao: 0.13, atraso: 0.09, tipo: 'triangle', volume: 0.22 });
    tocarTom(contexto, { frequencia: 783.99, duracao: 0.24, atraso: 0.18, tipo: 'triangle', volume: 0.24 });
  } catch (falha) {
    // Ambiente sem suporte a Web Audio: segue em silencio.
  }
}

/** Som curto e grave, tocado quando o jogador erra. */
export function tocarSomErro() {
  const contexto = obterContexto();
  if (!contexto) return;

  try {
    tocarTom(contexto, { frequencia: 220, duracao: 0.18, atraso: 0, tipo: 'sawtooth', volume: 0.16 });
    tocarTom(contexto, { frequencia: 164.81, duracao: 0.3, atraso: 0.12, tipo: 'sawtooth', volume: 0.18 });
  } catch (falha) {
    // Ambiente sem suporte a Web Audio: segue em silencio.
  }
}
