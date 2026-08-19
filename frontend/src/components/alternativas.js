/** Alternativas apresentadas ao jogador durante a partida. */
export const ALTERNATIVAS = [
  { valor: 'RF', rotulo: 'Requisito funcional', atalho: 'A', icone: 'fa-solid fa-gears' },
  { valor: 'RNF', rotulo: 'Requisito nao funcional', atalho: 'B', icone: 'fa-solid fa-gauge-high' },
  { valor: 'RN', rotulo: 'Regra de negocio', atalho: 'C', icone: 'fa-solid fa-scale-balanced' },
  { valor: 'NAO_CONDIZ_COM_TEMA', rotulo: 'Nao condiz com o tema', atalho: 'D', icone: 'fa-solid fa-ban' }
];

export function descreverAlternativa(valor) {
  return ALTERNATIVAS.find((alternativa) => alternativa.valor === valor)?.rotulo || 'Sem resposta';
}
