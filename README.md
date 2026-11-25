# TrackerFit

Tracker pessoal de hábitos fitness: você define hábitos de treino, água e sono, cada um com a sua meta diária, e registra o seu dia para acompanhar a constância (metas batidas e dias seguidos).
Projeto 1 da disciplina Programação Web (UEPB, 2026.2).

- **Aplicação:** (link da Vercel, a preencher após o deploy)
- **API:** (link do Render, a preencher após o deploy)
- **Vídeo de apresentação:** (link, a preencher)

> A API está no plano grátis do Render: o primeiro acesso pode levar cerca de
> um minuto, e os dados voltam aos de exemplo a cada reinício do serviço.

## Tecnologias

- Backend: Node.js 22+, Express 5, SQLite (`node:sqlite`, SQL puro)
- Frontend: HTML, CSS, Bootstrap 5, JavaScript puro (ES Modules, `fetch`)

## Como rodar localmente

Pré-requisito: Node.js 22 ou superior.

```bash
# 1. API
cd backend
npm install
cp .env.example .env
npm run dev                      # http://localhost:3000

# 2. Frontend (em outro terminal)
cd frontend
npx http-server -p 5500 -c-1     # http://localhost:5500
```

Variáveis de ambiente (`backend/.env`): `PORT`, `DB_FILE` (arquivo do SQLite) e `CORS_ORIGIN` (origens do front liberadas, separadas por vírgula).

## Rotas da API

| Método | Rota | O que faz | Respostas |
|---|---|---|---|
| GET | / | Health check | 200 |
| GET | /habitos | Lista os hábitos | 200 |
| POST | /habitos | Cria um hábito | 201, 400, 409 |
| GET | /habitos/:id | Busca um hábito | 200, 404 |
| PUT | /habitos/:id | Atualiza nome e meta | 200, 400, 404, 409 |
| DELETE | /habitos/:id | Remove um hábito | 204, 404, 409 |
| GET | /registros | Lista os registros (filtro opcional `?habitoId=`) | 200 |
| POST | /registros | Cria um registro | 201, 400, 409, 422 |
| GET | /registros/:id | Busca um registro | 200, 404 |
| PUT | /registros/:id | Atualiza o valor | 200, 400, 404 |
| DELETE | /registros/:id | Remove um registro | 204, 404 |

Erros seguem o formato `{ "erro": "mensagem" }`.

## Regras de negócio

- **Hábito:** `nome`, `tipo` e `meta` são obrigatórios (400); `tipo` é `treino`, `agua` ou `sono` (400); `meta` maior que zero (400); `nome` único (409), também ao editar.
- **Hábito:** o `tipo` não muda depois de criado (ele define a unidade: treino e sono em minutos, água em ml).
- **Hábito:** não pode ser removido enquanto tiver registros (409).
- **Registro:** `habitoId`, `data` e `valor` são obrigatórios (400).
- **Registro:** `data` no formato AAAA-MM-DD e `valor` ≥ 0 (400); para treino e sono, `valor` até 1440 minutos (400).
- **Registro:** o hábito informado precisa existir (422).
- **Registro:** no máximo um registro por hábito por data (409).

Na tela, o progresso, as metas batidas e a sequência de dias são calculados a partir desses dados.

## Estrutura

```
backend/
  src/
    routes/        mapeia URL → controller
    controllers/   lê a requisição, chama o service, responde
    services/      regras de negócio
    models/        acesso ao banco (SQL)
    middleware/    logger e tratamento de erros
    db.js          conexão e schema do SQLite
frontend/
  js/
    api.js         camada HTTP (fetch)
    services/      regras da tela
    state/         estado da aplicação
    ui/            desenho da tela
MODELAGEM.md       modelagem de classes (S2)
s1/ … s4/          exercícios das semanas
```

## Autor

Raul Henrique Alves de Sousa · Ciência da Computação · UEPB
