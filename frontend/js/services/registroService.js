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

// Metas de referência (regra da tela, não da API)
const META_AGUA_ML = 2000;
const SONO_IDEAL_MIN = [420, 540]; // 7h a 9h

// Acrescenta ao registro o que a tela precisa para desenhar: % da meta de água
// e a faixa do sono ('baixo' | 'ideal' | 'alto' | null quando não informado).
export function enriquecer(registro) {
  const sono = registro.duracaoSonoMinutos;
  let sonoFaixa = null;
  if (sono != null) {
    if (sono < SONO_IDEAL_MIN[0]) sonoFaixa = 'baixo';
    else if (sono > SONO_IDEAL_MIN[1]) sonoFaixa = 'alto';
    else sonoFaixa = 'ideal';
  }
  return {
    ...registro,
    aguaPct: Math.min(100, Math.round((registro.aguaConsumidaMl / META_AGUA_ML) * 100)),
    sonoFaixa,
  };
}

export const registroService = {
  async listar() {
    const lista = await api.get('/registros');
    // mais recentes primeiro: é o que a pessoa quer ver
    return lista.map(enriquecer).sort((a, b) => b.data.localeCompare(a.data) || b.id - a.id);
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
