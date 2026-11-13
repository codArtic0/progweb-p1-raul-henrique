# Testes da API — Projeto 1 (S3)

API: Tracker Fitness · entidades: Usuario e RegistroDiario (1:N) · servidor: `npm run dev` em http://localhost:3000

Regras de negócio (no service):

- **Usuario:** `nome` e `email` obrigatórios (400); email com formato válido (400); email único (409).
- **RegistroDiario:** `usuarioId` e `data` obrigatórios (400); `data` em AAAA-MM-DD, `aguaConsumidaMl` ≥ 0, `duracaoSonoMinutos` entre 0 e 1440 (400); o usuário precisa existir (422); no máximo um registro por usuário por data (409).

Sequência executada com o servidor recém-iniciado (memória vazia):

| # | Método | URL | Body | Status obtido | Observação |
|---|---|---|---|---|---|
| 1 | GET | / | — | 200 | health check com o nome da API e as rotas |
| 2 | POST | /usuarios | {"nome":"Raul Henrique","email":"raul@email.com"} | 201 | |
| 3 | POST | /registros | {"usuarioId":1,"data":"2026-11-13","foiAcademia":true,"aguaConsumidaMl":2000,"duracaoSonoMinutos":450} | 201 | |
| 4 | GET | /registros?usuarioId=1 | — | 200 | filtro 1:N |
| 5 | GET | /registros/1 | — | 200 | |
| 6 | GET | /registros/99 | — | 404 | registro inexistente |
| 7 | POST | /usuarios | {"nome":"Outro","email":"raul@email.com"} | 409 | regra: email único |
| 8 | POST | /usuarios | {"nome":"Sem Email"} | 400 | campo obrigatório ausente |
| 9 | POST | /registros | {"usuarioId":1,"data":"2026-11-13"} | 409 | regra: um registro por usuário por data |
| 10 | POST | /registros | {"usuarioId":999,"data":"2026-11-14"} | 422 | usuário não existe |
| 11 | POST | /registros | {"usuarioId":1,"data":"2026-11-14","aguaConsumidaMl":-5} | 400 | regra: água ≥ 0 |
| 12 | PUT | /registros/1 | {"aguaConsumidaMl":2500} | 200 | |
| 13 | PUT | /usuarios/1 | {"nome":"Raul H. Sousa"} | 200 | |
| 14 | DELETE | /registros/1 | — | 204 | |
| 15 | GET | /registros/1 | — | 404 | confirma a remoção |
| 16 | DELETE | /usuarios/1 | — | 204 | |
