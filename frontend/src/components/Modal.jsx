import { useEffect } from 'react';

export default function Modal({ aberto, titulo, children, rodape, aoFechar }) {
  useEffect(() => {
    if (!aberto) return undefined;

    function aoPressionarTecla(evento) {
      if (evento.key === 'Escape') aoFechar();
    }

    document.addEventListener('keydown', aoPressionarTecla);
    return () => document.removeEventListener('keydown', aoPressionarTecla);
  }, [aberto, aoFechar]);

  if (!aberto) return null;

  return (
    <div className="modal__fundo" role="presentation" onClick={aoFechar}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(evento) => evento.stopPropagation()}
      >
        <header className="modal__cabecalho">
          <h3>{titulo}</h3>
          <button type="button" className="modal__fechar" onClick={aoFechar} aria-label="Fechar">
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </header>
        <div className="modal__corpo">{children}</div>
        {rodape && <footer className="modal__rodape">{rodape}</footer>}
      </div>
    </div>
  );
}
