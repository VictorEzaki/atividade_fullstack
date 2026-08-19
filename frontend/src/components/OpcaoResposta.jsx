import PixelCard from './PixelCard';

export default function OpcaoResposta({ alternativa, estado = 'neutro', desabilitada = false, aoEscolher }) {
  const icone = {
    correta: 'fa-solid fa-circle-check',
    incorreta: 'fa-solid fa-circle-xmark',
    neutro: alternativa.icone
  }[estado];

  return (
    <PixelCard
      as="button"
      type="button"
      variante="clara"
      gap={6}
      velocidade={50}
      className={`opcao opcao--${estado}`}
      onClick={() => aoEscolher(alternativa.valor)}
      disabled={desabilitada}
    >
      <span className="opcao__atalho" aria-hidden="true">
        {alternativa.atalho}
      </span>
      <i className={icone} aria-hidden="true" />
      <span className="opcao__rotulo">{alternativa.rotulo}</span>
      {estado === 'correta' && <span className="opcao__marca">Resposta correta</span>}
      {estado === 'incorreta' && <span className="opcao__marca">Sua resposta</span>}
    </PixelCard>
  );
}
