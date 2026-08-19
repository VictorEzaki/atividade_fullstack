export default function Tabela({ colunas, dados, chave = (item) => item.id, mensagemVazia = 'Nada por aqui ainda.' }) {
  if (!dados || dados.length === 0) {
    return <p className="tabela__vazia">{mensagemVazia}</p>;
  }

  return (
    <div className="tabela__area">
      <table className="tabela">
        <thead>
          <tr>
            {colunas.map((coluna) => (
              <th key={coluna.campo} scope="col" style={coluna.largura ? { width: coluna.largura } : undefined}>
                {coluna.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dados.map((item) => (
            <tr key={chave(item)}>
              {colunas.map((coluna) => (
                <td key={coluna.campo} data-rotulo={coluna.titulo}>
                  {coluna.conteudo ? coluna.conteudo(item) : item[coluna.campo]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
