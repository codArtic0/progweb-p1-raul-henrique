# Telas do Projeto 1 (S4)

Front: `npx http-server -p 5500 -c-1` em `frontend/` · API: `npm run dev` em `backend/`

| Lista | Estado | Como provocar | O que aparece |
|---|---|---|---|
| Usuários | carregando | Network → throttling 3G → F5 | spinner "Carregando usuários…" |
| Usuários | vazio | API recém-iniciada | "Nenhum usuário ainda…" |
| Usuários | erro | Ctrl+C na API → F5 | "Não consegui falar com a API…" + Tentar de novo |
| Usuários | sucesso | cadastrar "Ana Lima" (ana@exemplo.com) | tabela com 1 linha |
| Usuários | erro de regra (400) | cadastrar com e-mail `ana@` | aviso "Email inválido" |
| Usuários | erro de regra (409) | cadastrar outro usuário com o mesmo e-mail | aviso "Já existe um usuário com este email" |
| Registros | carregando | Network → throttling 3G → F5 | spinner "Carregando registros…" |
| Registros | vazio | sem registros | "Nenhum registro ainda…" |
| Registros | erro | Ctrl+C na API → F5 | "Não consegui falar com a API…" + Tentar de novo |
| Registros | sucesso | escolher a Ana, data de hoje, marcar academia, 2000 ml, 480 min | tabela com o **nome** da Ana, "Sim", "2000 ml" e "8h00" |
| Registros | erro de regra (400) | água `-1` | aviso `Campo "aguaConsumidaMl" deve ser um número maior ou igual a 0` |
| Registros | erro de regra (409) | repetir usuário + data de um registro existente | aviso "Já existe um registro deste usuário para esta data" |
| Registros | usuário removido | remover o usuário que tem registro | registro continua, com "usuário #1 (removido)" (assunto da S5) |

## Camadas
- api: `js/api.js` · services: `js/services/` · state: `js/state/store.js` · ui: `js/ui/`
- `main.js` só liga as camadas: sem regra, sem `fetch`, sem `document.`
