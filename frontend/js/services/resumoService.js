// Regras do resumo: números derivados dos hábitos e dos registros já enriquecidos.
// Função pura (recebe "hoje" por parâmetro), fácil de testar.
import { chaveDoDia } from '../utils/datas.js';

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

// "Hoje": para cada hábito, o registro de hoje (ou null) e o quanto da meta já foi.
export function hojePorHabito(habitos, registros, hoje = new Date()) {
  const dia = chaveDoDia(hoje);
  return habitos.map((habito) => {
    const registro = registros.find((r) => r.habitoId === habito.id && r.data === dia) ?? null;
    return {
      habito,
      registro,
      pct: registro ? registro.pct : 0,
      atingiu: registro ? registro.atingiu : false,
    };
  });
}

// Últimos N dias (do mais antigo ao de hoje). nivel: 0 a 4 = fração de hábitos com meta batida.
export function ultimosDias(habitos, registros, hoje = new Date(), n = 14) {
  const dias = [];
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - i);
    const data = chaveDoDia(d);
    const batidas = registros.filter((r) => r.data === data && r.atingiu).length;
    const nivel = habitos.length ? Math.ceil((batidas / habitos.length) * 4) : 0;
    dias.push({ data, batidas, total: habitos.length, nivel });
  }
  return dias;
}
