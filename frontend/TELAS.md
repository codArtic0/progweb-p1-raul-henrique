# Telas do Projeto 1 (S4, atualizado na S5)

Front: `npx http-server -p 5500 -c-1` em `frontend/` · API: `npm run dev` em `backend/`

| Lista | Estado | Como provocar | O que aparece |
|---|---|---|---|
| Hábitos | carregando | Network → throttling 3G → F5 | spinner "Carregando hábitos…" |
| Hábitos | vazio | apagar `banco.db` e remover os hábitos de exemplo (ou `DB_FILE` novo sem seed) | "Nenhum hábito ainda…" |
| Hábitos | erro | Ctrl+C na API → F5 | "Não consegui falar com a API…" + Tentar de novo |
| Hábitos | sucesso | abrir a página | tabela com os hábitos e as metas |
| Hábitos | erro de regra (409) | criar um hábito com nome já existente | aviso "Já existe um hábito com este nome" |
| Hábitos | erro de regra (409) | remover um hábito que tem registros | aviso "Hábito possui registros. Remova os registros primeiro." |
| Registros | carregando | Network → throttling 3G → F5 | spinner "Carregando registros…" |
| Registros | vazio | sem registros | "Nenhum registro ainda…" |
| Registros | erro | Ctrl+C na API → F5 | "Não consegui falar com a API…" + Tentar de novo |
| Registros | sucesso | escolher "Beber água", hoje, 2000 | linha com "2000 ml de 2000 ml", selo "Meta batida" e barra cheia |
| Registros | erro de regra (400) | valor `-1` | aviso `O valor deve ser um número maior ou igual a 0.` |
| Registros | erro de regra (409) | repetir hábito + data de um registro existente | aviso "Já existe um registro deste hábito para esta data" |

## Camadas
- api: `js/api.js` · services: `js/services/` · state: `js/state/store.js` · ui: `js/ui/`
- `main.js` só liga as camadas: sem regra, sem `fetch`, sem `document.`
- O resumo do topo (sequência, metas batidas) vem de `services/resumoService.js`; a UI só desenha.
- O painel "Hoje" (anéis de progresso e faixa dos últimos 14 dias) vem de `services/resumoService.js`; `ui/hojeView.js` só desenha.
