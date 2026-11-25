import { DatabaseSync } from 'node:sqlite';

// O banco inteiro é um arquivo. Se não existir, o SQLite cria.
const arquivo = process.env.DB_FILE ?? 'banco.db';
export const db = new DatabaseSync(arquivo);

// No SQLite a checagem de chave estrangeira vem desligada.
// Tem de ligar a cada conexão.
db.exec('PRAGMA foreign_keys = ON;');

// O schema. IF NOT EXISTS: este arquivo roda toda vez que o servidor sobe.
// A tabela "pai" (habitos) vem antes da "filha" (registros).
// tipo define a unidade do hábito: treino e sono em minutos, água em ml.
db.exec(`
  CREATE TABLE IF NOT EXISTS habitos (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nome      TEXT NOT NULL UNIQUE,
    tipo      TEXT NOT NULL CHECK (tipo IN ('treino', 'agua', 'sono')),
    meta      REAL NOT NULL CHECK (meta > 0),
    criado_em TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS registros (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    habito_id INTEGER NOT NULL REFERENCES habitos(id),
    data      TEXT NOT NULL,
    valor     REAL NOT NULL CHECK (valor >= 0),
    UNIQUE (habito_id, data)
  );
`);

// Dados de exemplo: só entram se o banco estiver vazio.
// No Render grátis o arquivo some a cada reinício; assim a demo nunca abre vazia.
// As datas são relativas a hoje, para a sequência (streak) aparecer viva.
const { total } = db.prepare('SELECT COUNT(*) AS total FROM habitos').get();
if (total === 0) {
  const inserirHabito = db.prepare(
    'INSERT INTO habitos (nome, tipo, meta, criado_em) VALUES (?, ?, ?, ?)',
  );
  const inserirRegistro = db.prepare(
    'INSERT INTO registros (habito_id, data, valor) VALUES (?, ?, ?)',
  );
  const agora = new Date().toISOString();
  const academia = inserirHabito.run('Academia', 'treino', 45, agora).lastInsertRowid;
  const agua = inserirHabito.run('Beber água', 'agua', 2000, agora).lastInsertRowid;
  const sono = inserirHabito.run('Dormir bem', 'sono', 480, agora).lastInsertRowid;

  const diaAtras = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  // [dias atrás, treino (min), água (ml), sono (min)]; null = sem registro
  const historico = [
    [0, 50, 2100, 450], [1, 45, 1800, 420], [2, null, 2300, 500], [3, 60, 2000, 480],
    [4, null, 1500, 390], [5, 40, 2200, 465],
  ];
  for (const [n, t, a, s] of historico) {
    const data = diaAtras(n);
    if (t !== null) inserirRegistro.run(academia, data, t);
    inserirRegistro.run(agua, data, a);
    inserirRegistro.run(sono, data, s);
  }
}
