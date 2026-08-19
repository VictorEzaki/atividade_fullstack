import { useId } from 'react';

export default function CampoSelecao({ rotulo, opcoes = [], placeholder, ...restante }) {
  const identificador = useId();

  return (
    <div className="campo">
      <label className="campo__rotulo" htmlFor={identificador}>
        {rotulo}
      </label>
      <select id={identificador} className="campo__entrada" {...restante}>
        {placeholder && <option value="">{placeholder}</option>}
        {opcoes.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.texto}
          </option>
        ))}
      </select>
    </div>
  );
}
