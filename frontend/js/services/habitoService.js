import { api } from '../api.js';

// Regras do lado do front: limpar e validar ANTES de gastar uma requisição.
// O backend valida de novo (tipo, meta, nome único): nunca confie só no front.
function preparar({ nome, tipo, meta }) {
  const dados = { nome: (nome ?? '').trim(), tipo, meta: Number(meta) };
  if (!dados.nome) throw new Error('Informe o nome do hábito.');
  if (!dados.tipo) throw new Error('Escolha o tipo do hábito.');
  if (!(dados.meta > 0)) throw new Error('A meta deve ser um número maior que zero.');
  return dados;
}

export const habitoService = {
  listar() {
    return api.get('/habitos');
  },

  async criar(dados) {
    return api.post('/habitos', preparar(dados));
  },

  async atualizar(id, dados) {
    // o tipo não muda depois de criado: só nome e meta seguem
    const { nome, meta } = preparar(dados);
    return api.put(`/habitos/${id}`, { nome, meta });
  },

  remover(id) {
    return api.delete(`/habitos/${id}`);
  },
};
