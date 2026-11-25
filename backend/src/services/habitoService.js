import { habitoModel } from '../models/habitoModel.js';
import { registroModel } from '../models/registroModel.js';
import { erro } from '../utils/erro.js';

export const TIPOS = ['treino', 'agua', 'sono'];

function validarMeta(meta) {
  if (typeof meta !== 'number' || !(meta > 0)) {
    throw erro(400, 'Campo "meta" deve ser um número maior que zero');
  }
}

export const habitoService = {
  listar() {
    return habitoModel.listar();
  },

  buscarPorId(id) {
    const habito = habitoModel.buscarPorId(id);
    if (!habito) throw erro(404, 'Hábito não encontrado');
    return habito;
  },

  criar({ nome, tipo, meta } = {}) {
    // Regra 1: nome, tipo e meta são obrigatórios
    if (!nome || !tipo || meta === undefined) {
      throw erro(400, 'Campos "nome", "tipo" e "meta" são obrigatórios');
    }
    // Regra 2: tipo válido
    if (!TIPOS.includes(tipo)) throw erro(400, `Tipo deve ser um de: ${TIPOS.join(', ')}`);
    // Regra 3: meta maior que zero
    validarMeta(meta);
    // Regra 4: nome único
    if (habitoModel.buscarPorNome(nome)) throw erro(409, 'Já existe um hábito com este nome');
    return habitoModel.inserir({ nome, tipo, meta });
  },

  atualizar(id, dados = {}) {
    // o tipo não muda depois de criado: ele define a unidade dos registros
    const { nome, meta } = dados;
    if (nome !== undefined && !nome) throw erro(400, 'Campo "nome" não pode ser vazio');
    if (meta !== undefined) validarMeta(meta);
    if (nome !== undefined) {
      const outro = habitoModel.buscarPorNome(nome);
      if (outro && outro.id !== id) throw erro(409, 'Já existe um hábito com este nome');
    }
    const campos = {};
    if (nome !== undefined) campos.nome = nome;
    if (meta !== undefined) campos.meta = meta;
    const atualizado = habitoModel.atualizar(id, campos);
    if (!atualizado) throw erro(404, 'Hábito não encontrado');
    return atualizado;
  },

  remover(id) {
    // Regra: hábito com registros não pode ser removido
    if (registroModel.listarPorHabito(id).length > 0) {
      throw erro(409, 'Hábito possui registros. Remova os registros primeiro.');
    }
    const removido = habitoModel.remover(id);
    if (!removido) throw erro(404, 'Hábito não encontrado');
  },
};
