import { api } from '../api.js';

// Campo numérico opcional: vazio vira undefined (o JSON.stringify omite),
// e o backend usa o valor padrão.
function numeroOpcional(valor, rotulo) {
  if (valor === undefined || valor === '') return undefined;
  const n = Number(valor);
  if (Number.isNaN(n)) throw new Error(`${rotulo} deve ser um número.`);
  return n;
}

// Só os campos que o backend aceita alterar (usuarioId e data não mudam).
function camposEditaveis({ foiAcademia, aguaConsumidaMl, duracaoSonoMinutos }) {
  return {
    // checkbox desmarcado não aparece no FormData: some a chave, vira false
    foiAcademia: foiAcademia === 'on' || foiAcademia === true,
    aguaConsumidaMl: numeroOpcional(aguaConsumidaMl, 'Água'),
    duracaoSonoMinutos: numeroOpcional(duracaoSonoMinutos, 'Sono'),
  };
}

function prepararCriacao(dados) {
  if (!dados.usuarioId) throw new Error('Selecione o usuário.');
  if (!dados.data) throw new Error('Informe a data.');
  // Formulário só entrega string: convertemos o id do pai antes de enviar
  return { usuarioId: Number(dados.usuarioId), data: dados.data, ...camposEditaveis(dados) };
}

export const registroService = {
  listar() {
    return api.get('/registros');
  },

  async criar(dados) {
    return api.post('/registros', prepararCriacao(dados));
  },

  async atualizar(id, dados) {
    return api.put(`/registros/${id}`, camposEditaveis(dados));
  },

  remover(id) {
    return api.delete(`/registros/${id}`);
  },
};
