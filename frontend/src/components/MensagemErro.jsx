export default function MensagemErro({ mensagem, aoTentarNovamente }) {
  if (!mensagem) return null;

  return (
    <div className="aviso aviso--erro" role="alert">
      <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
      <span>{mensagem}</span>
      {aoTentarNovamente && (
        <button type="button" className="aviso__acao" onClick={aoTentarNovamente}>
          Tentar de novo
        </button>
      )}
    </div>
  );
}
