// Funções puras de data, compartilhadas por services e ui.
// Datas da API são texto 'AAAA-MM-DD'; evitamos new Date(texto), que desloca o fuso.

// Date → 'AAAA-MM-DD' no fuso local (o mesmo formato do <input type="date">)
export function chaveDoDia(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function hoje() {
  return chaveDoDia(new Date());
}

// '2026-11-17' → '17/11/2026'
export function formatarData(data) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}
