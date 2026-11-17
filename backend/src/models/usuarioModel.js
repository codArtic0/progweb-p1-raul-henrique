// "Banco de dados" em memória: um array. Na S5 vira SQLite.
let usuarios = [];
let proximoId = 1;

export const usuarioModel = {
  listar() {
    return usuarios;
  },

  buscarPorId(id) {
    return usuarios.find((u) => u.id === id) ?? null;
  },

  existeEmail(email) {
    return usuarios.some((u) => u.email === email);
  },

  inserir({ nome, email }) {
    const novo = { id: proximoId++, nome, email, criadoEm: new Date().toISOString() };
    usuarios.push(novo);
    return novo;
  },

  atualizar(id, dados) {
    const i = usuarios.findIndex((u) => u.id === id);
    if (i === -1) return null;
    usuarios[i] = { ...usuarios[i], ...dados, id }; // o id nunca muda
    return usuarios[i];
  },

  remover(id) {
    const antes = usuarios.length;
    usuarios = usuarios.filter((u) => u.id !== id);
    return usuarios.length < antes; // true = removeu
  },
};
