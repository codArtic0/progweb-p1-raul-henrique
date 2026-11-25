# Tracker Fitness

Aplicação fullstack que monitora hábitos saudáveis diários: cada usuário registra, por dia, se foi à academia, quanta água bebeu e quanto dormiu.
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
| GET | /usuarios | Lista os usuários | 200 |
| POST | /usuarios | Cria um usuário | 201, 400, 409 |
| GET | /usuarios/:id | Busca um usuário | 200, 404 |
| PUT | /usuarios/:id | Atualiza um usuário | 200, 404 |
| DELETE | /usuarios/:id | Remove um usuário | 204, 404, 409 |
| GET | /registros | Lista os registros (filtro opcional `?usuarioId=`) | 200 |
| POST | /registros | Cria um registro diário | 201, 400, 409, 422 |
| GET | /registros/:id | Busca um registro | 200, 404 |
| PUT | /registros/:id | Atualiza um registro | 200, 400, 404 |
| DELETE | /registros/:id | Remove um registro | 204, 404 |

Erros seguem o formato `{ "erro": "mensagem" }`.

## Regras de negócio

- **Usuário:** `nome` e `email` são obrigatórios (400); o e-mail precisa ter formato válido (400) e ser único (409).
- **Usuário:** não pode ser removido enquanto tiver registros diários (409).
- **Registro diário:** `usuarioId` e `data` são obrigatórios (400).
- **Registro diário:** `data` no formato AAAA-MM-DD, `aguaConsumidaMl` ≥ 0 e `duracaoSonoMinutos` entre 0 e 1440 (400).
- **Registro diário:** o usuário informado precisa existir (422).
- **Registro diário:** no máximo um registro por usuário por data (409).

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
