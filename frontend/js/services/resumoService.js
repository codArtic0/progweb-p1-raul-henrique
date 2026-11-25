// Regras do resumo: números derivados dos hábitos e dos registros já enriquecidos.
// Função pura (recebe "hoje" por parâmetro), fácil de testar.
function chaveDoDia(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Sequência: dias seguidos, até hoje, com pelo menos uma meta batida.
// Se hoje ainda não tem meta batida, a conta começa por ontem (o dia ainda não acabou).
function calcularSequencia(registros, hoje) {
  const dias = new Set(registros.filter((r) => r.atingiu).map((r) => r.data));
  const cursor = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  if (!dias.has(chaveDoDia(cursor))) cursor.setDate(cursor.getDate() - 1);

  let sequencia = 0;
  while (dias.has(chaveDoDia(cursor))) {
    sequencia += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return sequencia;
}

export function calcularResumo(habitos, registros, hoje = new Date()) {
  const batidas = registros.filter((r) => r.atingiu).length;
  return {
    habitos: habitos.length,
    registros: registros.length,
    metasBatidas: batidas,
    percentualMetas: registros.length ? Math.round((batidas / registros.length) * 100) : null,
    sequencia: calcularSequencia(registros, hoje),
  };
}
