export default function Placar({ pontuacao }) {
  return (
    <div className="placar">
      <i className="fa-solid fa-star" aria-hidden="true" />
      <div>
        <span className="placar__rotulo">Pontos</span>
        <strong className="placar__valor">{pontuacao}</strong>
      </div>
    </div>
  );
}
