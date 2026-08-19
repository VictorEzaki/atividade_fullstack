/**
 * Embaralhamento de Fisher-Yates.
 * Retorna uma nova lista, sem alterar a original.
 */
function embaralhar(lista) {
  const copia = [...lista];
  for (let indice = copia.length - 1; indice > 0; indice -= 1) {
    const sorteado = Math.floor(Math.random() * (indice + 1));
    [copia[indice], copia[sorteado]] = [copia[sorteado], copia[indice]];
  }
  return copia;
}

module.exports = { embaralhar };
