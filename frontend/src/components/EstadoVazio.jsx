export default function EstadoVazio({ icone = 'fa-solid fa-inbox', titulo, descricao, acao }) {
  return (
    <div className="estado-vazio">
      <i className={icone} aria-hidden="true" />
      <h3>{titulo}</h3>
      {descricao && <p className="texto-secundario">{descricao}</p>}
      {acao}
    </div>
  );
}
