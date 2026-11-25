import { registroModel } from '../models/registroModel.js';
import { habitoModel } from '../models/habitoModel.js';
import { erro } from '../utils/erro.js';

const FORMATO_DATA = /^\d{4}-\d{2}-\d{2}$/;

function validarData(data) {
  if (!FORMATO_DATA.test(data) || Number.isNaN(Date.parse(data))) {
    throw erro(400, 'Campo "data" deve estar no formato AAAA-MM-DD');
  }
}

// Água em ml não tem teto; treino e sono são minutos de um dia (até 1440).
function validarValor(valor, tipo) {
  if (typeof valor !== 'number' || Number.isNaN(valor) || valor < 0) {
    throw erro(400, 'Campo "valor" deve ser um número maior ou igual a 0');
  }
  if (tipo !== 'agua' && valor > 1440) {
    throw erro(400, 'Para treino e sono, "valor" (em minutos) deve ser no máximo 1440');
  }
}

export const registroService = {
  listar(habitoId) {
    if (habitoId) return registroModel.listarPorHabito(Number(habitoId));
    return registroModel.listar();
  },

  buscarPorId(id) {
    const registro = registroModel.buscarPorId(id);
    if (!registro) throw erro(404, 'Registro não encontrado');
    return registro;
  },

  criar({ habitoId, data, valor } = {}) {
    // Regra 1: habitoId, data e valor são obrigatórios
    if (!habitoId || !data || valor === undefined) {
      throw erro(400, 'Campos "habitoId", "data" e "valor" são obrigatórios');
    }
    // Regra 2: data e valor válidos
    validarData(data);
    // Regra 3: o hábito precisa existir
    const habito = habitoModel.buscarPorId(Number(habitoId));
    if (!habito) throw erro(422, 'Hábito informado não existe');
    validarValor(valor, habito.tipo);
    // Regra 4: no máximo um registro por hábito por data
    if (registroModel.existeDataParaHabito(habito.id, data)) {
      throw erro(409, 'Já existe um registro deste hábito para esta data');
    }
    return registroModel.inserir({ habitoId: habito.id, data, valor });
  },

  atualizar(id, { valor } = {}) {
    // habitoId e data não mudam depois de criados: só o valor
    const atual = registroModel.buscarPorId(id);
    if (!atual) throw erro(404, 'Registro não encontrado');
    if (valor === undefined) throw erro(400, 'Campo "valor" é obrigatório');
    validarValor(valor, habitoModel.buscarPorId(atual.habitoId).tipo);
    return registroModel.atualizar(id, { valor });
  },

  remover(id) {
    const removido = registroModel.remover(id);
    if (!removido) throw erro(404, 'Registro não encontrado');
  },
};
