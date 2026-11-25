import { db } from '../db.js';

// No banco: snake_case. No JSON da API: camelCase. O AS traduz aqui.
const COLUNAS = 'id, habito_id AS habitoId, data, valor';

export const registroModel = {
  listar() {
    return db.prepare(`SELECT ${COLUNAS} FROM registros ORDER BY id`).all();
  },

  listarPorHabito(habitoId) {
    return db
      .prepare(`SELECT ${COLUNAS} FROM registros WHERE habito_id = ? ORDER BY id`)
      .all(habitoId);
  },

  buscarPorId(id) {
    return db.prepare(`SELECT ${COLUNAS} FROM registros WHERE id = ?`).get(id) ?? null;
  },

  existeDataParaHabito(habitoId, data) {
    const linha = db
      .prepare('SELECT 1 FROM registros WHERE habito_id = ? AND data = ?')
      .get(habitoId, data);
    return linha !== undefined;
  },

  inserir({ habitoId, data, valor }) {
    const r = db
      .prepare('INSERT INTO registros (habito_id, data, valor) VALUES (?, ?, ?)')
      .run(Number(habitoId), data, Number(valor));
    return this.buscarPorId(r.lastInsertRowid);
  },

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) return null;
    const novo = { ...atual, ...dados };
    db.prepare('UPDATE registros SET valor = ? WHERE id = ?').run(Number(novo.valor), id);
    return this.buscarPorId(id);
  },

  remover(id) {
    const r = db.prepare('DELETE FROM registros WHERE id = ?').run(id);
    return r.changes > 0;
  },
};
