import { api } from '../api.js';

// Regras do lado do front: limpar e validar ANTES de gastar uma requisição.
// O backend valida de novo (formato do e-mail, e-mail único): nunca confie só no front.
function preparar({ nome, email }) {
  const dados = {
    nome: (nome ?? '').trim(),
    email: (email ?? '').trim(),
  };
  if (!dados.nome) throw new Error('Informe o nome.');
  if (!dados.email) throw new Error('Informe o e-mail.');
  return dados;
}

export const usuarioService = {
  listar() {
    return api.get('/usuarios');
  },

  async criar(dados) {
    return api.post('/usuarios', preparar(dados));
  },

  async atualizar(id, dados) {
    return api.put(`/usuarios/${id}`, preparar(dados));
  },

  remover(id) {
    return api.delete(`/usuarios/${id}`);
  },
};
