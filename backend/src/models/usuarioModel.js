import { db } from '../db.js';

// Mesmo contrato da S3 (listar, buscarPorId, existeEmail, inserir,
// atualizar, remover). Só o "como" mudou: o array virou tabela.
// No banco: snake_case (criado_em). No JSON da API: camelCase (criadoEm).
const COLUNAS = 'id, nome, email, criado_em AS criadoEm';

export const usuarioModel = {
  listar() {
    return db.prepare(`SELECT ${COLUNAS} FROM usuarios ORDER BY id`).all();
  },

  buscarPorId(id) {
    return db.prepare(`SELECT ${COLUNAS} FROM usuarios WHERE id = ?`).get(id) ?? null;
  },

  existeEmail(email) {
    const linha = db.prepare('SELECT 1 FROM usuarios WHERE email = ?').get(email);
    return linha !== undefined;
  },

  inserir({ nome, email }) {
    const r = db
      .prepare('INSERT INTO usuarios (nome, email, criado_em) VALUES (?, ?, ?)')
      .run(nome, email, new Date().toISOString());
    return this.buscarPorId(r.lastInsertRowid);
  },

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) return null;
    const novo = { ...atual, ...dados };
    db.prepare('UPDATE usuarios SET nome = ?, email = ? WHERE id = ?')
      .run(novo.nome, novo.email, id); // o id nunca muda
    return this.buscarPorId(id);
  },

  remover(id) {
    const r = db.prepare('DELETE FROM usuarios WHERE id = ?').run(id);
    return r.changes > 0; // true = removeu
  },
};
