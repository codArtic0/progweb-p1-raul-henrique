# Testes da API — Projeto 1 (S3, atualizado na S5)

API: TrackerFit · entidades: Habito e Registro (1:N) · servidor: `npm run dev` em http://localhost:3000

Regras de negócio (no service):

- **Habito:** `nome`, `tipo` e `meta` obrigatórios (400); `tipo` ∈ treino/agua/sono (400); `meta` > 0 (400); `nome` único (409, inclusive ao editar); hábito com registros não é removido (409).
- **Registro:** `habitoId`, `data` e `valor` obrigatórios (400); `data` em AAAA-MM-DD e `valor` ≥ 0 (400); treino/sono até 1440 min (400); o hábito precisa existir (422); no máximo um registro por hábito por data (409).

Sequência executada com o banco recém-criado (3 hábitos e 16 registros de exemplo):

| # | Método | URL | Body | Status obtido | Observação |
|---|---|---|---|---|---|
| 1 | GET | /habitos | — | 200 | 3 hábitos de exemplo |
| 2 | GET | /registros | — | 200 | 16 registros de exemplo |
| 3 | POST | /habitos | {"nome":"Corrida","tipo":"treino","meta":30} | 201 | |
| 4 | POST | /habitos | {"nome":"Corrida","tipo":"treino","meta":30} | 409 | regra: nome único |
| 5 | POST | /habitos | {"nome":"X","tipo":"yoga","meta":30} | 400 | tipo inválido |
| 6 | POST | /habitos | {"nome":"X","tipo":"agua","meta":0} | 400 | meta > 0 |
| 7 | POST | /habitos | {"nome":"X"} | 400 | campo obrigatório ausente |
| 8 | PUT | /habitos/4 | {"meta":40} | 200 | |
| 9 | PUT | /habitos/4 | {"nome":"Academia"} | 409 | nome de outro hábito |
| 10 | POST | /registros | {"habitoId":4,"data":"2026-11-20","valor":35} | 201 | |
| 11 | POST | /registros | {"habitoId":4,"data":"2026-11-20","valor":35} | 409 | regra: um registro por hábito por data |
| 12 | POST | /registros | {"habitoId":999,"data":"2026-11-20","valor":1} | 422 | hábito não existe |
| 13 | POST | /registros | {"habitoId":4,"data":"2026-11-21","valor":-1} | 400 | valor ≥ 0 |
| 14 | POST | /registros | {"habitoId":4,"data":"2026-11-21","valor":2000} | 400 | treino acima de 1440 min |
| 15 | GET | /registros?habitoId=4 | — | 200 | filtro 1:N |
| 16 | PUT | /registros/17 | {"valor":50} | 200 | |
| 17 | DELETE | /habitos/4 | — | 409 | hábito com registros |
| 18 | DELETE | /registros/17 | — | 204 | |
| 19 | DELETE | /habitos/4 | — | 204 | |
| 20 | GET | /habitos/4 | — | 404 | confirma a remoção |
