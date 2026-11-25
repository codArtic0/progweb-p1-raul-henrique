import { db } from '../db.js';

// No banco: snake_case. No JSON da API: camelCase. O AS traduz aqui,
// na única camada que conhece o banco.
const COLUNAS = `id, usuario_id AS usuarioId, data,
  foi_academia, agua_consumida_ml AS aguaConsumidaMl,
  duracao_sono_minutos AS duracaoSonoMinutos`;

// O banco guarda 1 ou 0; a API devolve true ou false.
const paraApi = (linha) => {
  if (!linha) return linha;
  const { foi_academia, ...resto } = linha;
  return { ...resto, foiAcademia: foi_academia === 1 };
};

export const registroDiarioModel = {
  listar() {
    return db.prepare(`SELECT ${COLUNAS} FROM registros_diarios ORDER BY id`).all().map(paraApi);
  },

  listarPorUsuario(usuarioId) {
    return db
      .prepare(`SELECT ${COLUNAS} FROM registros_diarios WHERE usuario_id = ? ORDER BY id`)
      .all(usuarioId)
      .map(paraApi);
  },

  buscarPorId(id) {
    return paraApi(
      db.prepare(`SELECT ${COLUNAS} FROM registros_diarios WHERE id = ?`).get(id),
    ) ?? null;
  },

  existeDataParaUsuario(usuarioId, data) {
    const linha = db
      .prepare('SELECT 1 FROM registros_diarios WHERE usuario_id = ? AND data = ?')
      .get(usuarioId, data);
    return linha !== undefined;
  },

  inserir({ usuarioId, data, foiAcademia, aguaConsumidaMl, duracaoSonoMinutos }) {
    const r = db
      .prepare(`INSERT INTO registros_diarios
                  (usuario_id, data, foi_academia, agua_consumida_ml, duracao_sono_minutos)
                VALUES (?, ?, ?, ?, ?)`)
      .run(
        Number(usuarioId),
        data,
        foiAcademia ? 1 : 0,
        aguaConsumidaMl ?? 0,
        duracaoSonoMinutos ?? null,
      );
    return this.buscarPorId(r.lastInsertRowid);
  },

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) return null;
    const novo = { ...atual, ...dados };
    db.prepare(`UPDATE registros_diarios
                SET foi_academia = ?, agua_consumida_ml = ?, duracao_sono_minutos = ?
                WHERE id = ?`)
      .run(novo.foiAcademia ? 1 : 0, novo.aguaConsumidaMl, novo.duracaoSonoMinutos ?? null, id);
    return this.buscarPorId(id);
  },

  remover(id) {
    const r = db.prepare('DELETE FROM registros_diarios WHERE id = ?').run(id);
    return r.changes > 0;
  },
};
