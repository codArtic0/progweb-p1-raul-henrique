import { db } from '../db.js';

// No banco: snake_case (criado_em). No JSON da API: camelCase (criadoEm).
const COLUNAS = 'id, nome, tipo, meta, criado_em AS criadoEm';

export const habitoModel = {
  listar() {
    return db.prepare(`SELECT ${COLUNAS} FROM habitos ORDER BY id`).all();
  },

  buscarPorId(id) {
    return db.prepare(`SELECT ${COLUNAS} FROM habitos WHERE id = ?`).get(id) ?? null;
  },

  buscarPorNome(nome) {
    return db.prepare(`SELECT ${COLUNAS} FROM habitos WHERE nome = ?`).get(nome) ?? null;
  },

  inserir({ nome, tipo, meta }) {
    const r = db
      .prepare('INSERT INTO habitos (nome, tipo, meta, criado_em) VALUES (?, ?, ?, ?)')
      .run(nome, tipo, Number(meta), new Date().toISOString());
    return this.buscarPorId(r.lastInsertRowid);
  },

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) return null;
    const novo = { ...atual, ...dados };
    // o id e o tipo nunca mudam: o tipo define a unidade dos registros
    db.prepare('UPDATE habitos SET nome = ?, meta = ? WHERE id = ?')
      .run(novo.nome, Number(novo.meta), id);
    return this.buscarPorId(id);
  },

  remover(id) {
    const r = db.prepare('DELETE FROM habitos WHERE id = ?').run(id);
    return r.changes > 0; // true = removeu
  },
};
