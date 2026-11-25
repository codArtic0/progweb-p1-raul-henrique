// Como cada tipo de hábito aparece na tela: nome, unidade e ícone.
// É apresentação (cor, rótulo, ícone); a cor vem das classes .tipo-* do CSS.
export const TIPOS = {
  treino: { rotulo: 'Treino', unidade: 'min', icone: 'halter' },
  agua: { rotulo: 'Água', unidade: 'ml', icone: 'gota' },
  sono: { rotulo: 'Sono', unidade: 'min', icone: 'lua' },
};

// sono: 450 → "7h30" · treino: 45 → "45 min" · água: 2000 → "2000 ml"
export function formatarValor(tipo, valor) {
  if (tipo === 'agua') return `${valor} ml`;
  if (tipo === 'sono' && valor >= 60) return `${Math.floor(valor / 60)}h${String(Math.round(valor % 60)).padStart(2, '0')}`;
  return `${valor} min`;
}
