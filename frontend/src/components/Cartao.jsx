export default function Cartao({ titulo, descricao, acao, children, destaque = false, className = '' }) {
  return (
    <section className={`cartao ${destaque ? 'cartao--destaque' : ''} ${className}`}>
      {(titulo || acao) && (
        <header className="cartao__cabecalho">
          <div>
            {titulo && <h3 className="cartao__titulo">{titulo}</h3>}
            {descricao && <p className="texto-secundario">{descricao}</p>}
          </div>
          {acao}
        </header>
      )}
      {children}
    </section>
  );
}
