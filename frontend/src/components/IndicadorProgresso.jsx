export default function IndicadorProgresso({ atual, total, rotulo = 'Progresso da partida' }) {
  const percentual = total > 0 ? Math.min(100, Math.round((atual / total) * 100)) : 0;

  return (
    <div className="progresso">
      <div className="progresso__topo">
        <span className="progresso__rotulo">{rotulo}</span>
        <strong className="progresso__valor">
          {atual} de {total}
        </strong>
      </div>
      <div
        className="progresso__trilha"
        role="progressbar"
        aria-valuenow={atual}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={rotulo}
      >
        <div className="progresso__preenchimento" style={{ width: `${percentual}%` }} />
      </div>
    </div>
  );
}
