import { useId } from 'react';

export default function CampoTexto({ rotulo, ajuda, erro, tipo = 'text', multilinha = false, ...restante }) {
  const identificador = useId();
  const identificadorAjuda = `${identificador}-ajuda`;

  const Elemento = multilinha ? 'textarea' : 'input';

  return (
    <div className="campo">
      <label className="campo__rotulo" htmlFor={identificador}>
        {rotulo}
      </label>
      <Elemento
        id={identificador}
        className={`campo__entrada ${erro ? 'campo__entrada--erro' : ''}`}
        type={multilinha ? undefined : tipo}
        aria-describedby={ajuda || erro ? identificadorAjuda : undefined}
        aria-invalid={erro ? 'true' : undefined}
        rows={multilinha ? 4 : undefined}
        {...restante}
      />
      {(ajuda || erro) && (
        <span id={identificadorAjuda} className={`campo__ajuda ${erro ? 'campo__ajuda--erro' : ''}`}>
          {erro && <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />} {erro || ajuda}
        </span>
      )}
    </div>
  );
}
