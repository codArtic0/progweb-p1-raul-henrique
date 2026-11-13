import { usuarioModel } from '../models/usuarioModel.js';
import { erro } from '../utils/erro.js';

export const usuarioService = {
  listar() {
    return usuarioModel.listar();
  },

  buscarPorId(id) {
    const usuario = usuarioModel.buscarPorId(id);
    if (!usuario) throw erro(404, 'Usuário não encontrado');
    return usuario;
  },

  criar({ nome, email } = {}) {
    // Regra 1: nome e email são obrigatórios
    if (!nome || !email) throw erro(400, 'Campos "nome" e "email" são obrigatórios');
    // Regra 2: email com formato válido
    if (!/^\S+@\S+\.\S+$/.test(email)) throw erro(400, 'Email inválido');
    // Regra 3: email é único
    if (usuarioModel.existeEmail(email)) throw erro(409, 'Já existe um usuário com este email');
    return usuarioModel.inserir({ nome, email });
  },

  atualizar(id, dados = {}) {
    const atualizado = usuarioModel.atualizar(id, dados);
    if (!atualizado) throw erro(404, 'Usuário não encontrado');
    return atualizado;
  },

  remover(id) {
    const removido = usuarioModel.remover(id);
    if (!removido) throw erro(404, 'Usuário não encontrado');
  },
};
