export default function CartaoRequisito({ texto, tema }) {
  return (
    <article className="cartao-requisito">
      <span className="cartao-requisito__contexto">
        Tema da rodada: <strong>{tema}</strong>
      </span>
      <p className="cartao-requisito__texto">{texto}</p>
    </article>
  );
}
