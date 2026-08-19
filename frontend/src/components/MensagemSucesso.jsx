export default function MensagemSucesso({ mensagem }) {
  if (!mensagem) return null;

  return (
    <div className="aviso aviso--sucesso" role="status">
      <i className="fa-solid fa-circle-check" aria-hidden="true" />
      <span>{mensagem}</span>
    </div>
  );
}
