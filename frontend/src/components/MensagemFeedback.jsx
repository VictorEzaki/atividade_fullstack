import { descreverAlternativa } from './alternativas';

export default function MensagemFeedback({ feedback }) {
  if (!feedback) return null;

  const acertou = feedback.correta;

  return (
    <div className={`feedback ${acertou ? 'feedback--sucesso' : 'feedback--erro'}`} role="status">
      <i className={acertou ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'} aria-hidden="true" />
      <div>
        <strong>{acertou ? 'Acertou!' : 'Nao foi dessa vez.'}</strong>
        <p className="texto-secundario">
          {acertou
            ? `+${feedback.pontuacaoGanha} pontos para o seu placar.`
            : `A classificacao correta era: ${descreverAlternativa(feedback.respostaCorreta)}.`}
        </p>
      </div>
    </div>
  );
}
