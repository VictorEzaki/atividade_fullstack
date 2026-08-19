export default function Botao({
  children,
  variante = 'primario',
  tamanho = 'medio',
  icone,
  carregando = false,
  className = '',
  ...restante
}) {
  const classes = ['botao', `botao--${variante}`, `botao--${tamanho}`, className].filter(Boolean).join(' ');

  return (
    <button className={classes} disabled={carregando || restante.disabled} {...restante}>
      {carregando ? (
        <i className="fa-solid fa-circle-notch fa-spin" aria-hidden="true" />
      ) : (
        icone && <i className={icone} aria-hidden="true" />
      )}
      <span>{children}</span>
    </button>
  );
}
