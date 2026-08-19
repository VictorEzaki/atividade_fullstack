export default function Carregamento({ mensagem = 'Carregando...' }) {
  return (
    <div className="carregamento" role="status" aria-live="polite">
      <i className="fa-solid fa-circle-notch fa-spin" aria-hidden="true" />
      <span>{mensagem}</span>
    </div>
  );
}
