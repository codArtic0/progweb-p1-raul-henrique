import { DatabaseSync } from 'node:sqlite';

// O banco inteiro é um arquivo. Se não existir, o SQLite cria.
const arquivo = process.env.DB_FILE ?? 'banco.db';
export const db = new DatabaseSync(arquivo);

// No SQLite a checagem de chave estrangeira vem desligada.
// Tem de ligar a cada conexão.
db.exec('PRAGMA foreign_keys = ON;');

// O schema. IF NOT EXISTS: este arquivo roda toda vez que o servidor sobe.
// A tabela "pai" (usuarios) vem antes da "filha" (registros_diarios).
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nome      TEXT NOT NULL,
    email     TEXT NOT NULL UNIQUE,
    criado_em TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS registros_diarios (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id           INTEGER NOT NULL REFERENCES usuarios(id),
    data                 TEXT NOT NULL,
    foi_academia         INTEGER NOT NULL DEFAULT 0,
    agua_consumida_ml    REAL NOT NULL DEFAULT 0,
    duracao_sono_minutos REAL,
    UNIQUE (usuario_id, data)
  );
`);

// Dados de exemplo: só entram se o banco estiver vazio.
// No Render grátis o arquivo some a cada reinício; assim a demo nunca abre vazia.
const { total } = db.prepare('SELECT COUNT(*) AS total FROM usuarios').get();
if (total === 0) {
  const inserirUsuario = db.prepare(
    'INSERT INTO usuarios (nome, email, criado_em) VALUES (?, ?, ?)',
  );
  const inserirRegistro = db.prepare(
    `INSERT INTO registros_diarios
       (usuario_id, data, foi_academia, agua_consumida_ml, duracao_sono_minutos)
     VALUES (?, ?, ?, ?, ?)`,
  );
  const agora = new Date().toISOString();

  const ana = inserirUsuario.run('Ana Exemplo', 'ana@exemplo.com', agora).lastInsertRowid;
  const bruno = inserirUsuario.run('Bruno Exemplo', 'bruno@exemplo.com', agora).lastInsertRowid;

  inserirRegistro.run(ana, '2026-11-10', 1, 2200, 450);
  inserirRegistro.run(ana, '2026-11-11', 0, 1800, 420);
  inserirRegistro.run(ana, '2026-11-12', 1, 2500, 480);
  inserirRegistro.run(bruno, '2026-11-10', 0, 1500, 390);
  inserirRegistro.run(bruno, '2026-11-11', 1, 2000, 435);
}
