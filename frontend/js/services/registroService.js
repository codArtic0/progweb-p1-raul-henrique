import { api } from '../api.js';

function lerValor(valor) {
  if (valor === undefined || valor === '') throw new Error('Informe quanto você fez.');
  const n = Number(valor);
  if (Number.isNaN(n) || n < 0) throw new Error('O valor deve ser um número maior ou igual a 0.');
  return n;
}

function prepararCriacao({ habitoId, data, valor }) {
  if (!habitoId) throw new Error('Selecione o hábito.');
  if (!data) throw new Error('Informe a data.');
  // Formulário só entrega string: convertemos antes de enviar
  return { habitoId: Number(habitoId), data, valor: lerValor(valor) };
}

// Junta cada registro ao seu hábito e calcula o progresso da meta.
// habito = null quando o hábito não existe na lista (registro órfão).
export function enriquecer(registros, habitos) {
  const porId = new Map(habitos.map((h) => [h.id, h]));
  return registros
    .map((r) => {
      const habito = porId.get(r.habitoId) ?? null;
      const pct = habito ? Math.min(100, Math.round((r.valor / habito.meta) * 100)) : 0;
      return { ...r, habito, pct, atingiu: habito ? r.valor >= habito.meta : false };
    })
    // mais recentes primeiro: é o que a pessoa quer ver
    .sort((a, b) => b.data.localeCompare(a.data) || b.id - a.id);
}

export const registroService = {
  listar() {
    return api.get('/registros');
  },

  async criar(dados) {
    return api.post('/registros', prepararCriacao(dados));
  },

  async atualizar(id, { valor }) {
    // habitoId e data não mudam: só o valor
    return api.put(`/registros/${id}`, { valor: lerValor(valor) });
  },

  remover(id) {
    return api.delete(`/registros/${id}`);
  },
};
