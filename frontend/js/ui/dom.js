// Peças de DOM repetidas pelas views. Texto entra sempre como TEXTO, nunca como HTML.
import { icone } from './icones.js';

export function celula(classe = '', rotulo = '') {
  const td = document.createElement('td');
  td.className = classe;
  if (rotulo) td.dataset.rotulo = rotulo; // usado pelo layout de cartões no celular
  return td;
}

// Botão de ação da linha: só ícone, com nome acessível. data-acao/data-id alimentam a delegação.
export function botaoAcao({ rotulo, icone: nomeIcone, acao, id, classe }) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `btn btn-sm btn-icone ${classe}`;
  b.dataset.acao = acao;
  b.dataset.id = id;
  b.setAttribute('aria-label', rotulo);
  b.title = rotulo;
  b.append(icone(nomeIcone));
  return b;
}

// Os dois botões padrão (editar e remover) de uma linha.
export function celulaDeAcoes(id, nome) {
  const acoes = celula('text-end text-nowrap celula-acoes');
  acoes.append(
    botaoAcao({ rotulo: `Editar ${nome}`, icone: 'lapis', acao: 'editar', id, classe: 'btn-outline-primary me-1' }),
    botaoAcao({ rotulo: `Remover ${nome}`, icone: 'lixeira', acao: 'remover', id, classe: 'btn-outline-danger' }),
  );
  return acoes;
}

// Mostra só o bloco do estado atual: 'carregando' | 'erro' | 'vazio' | 'sucesso'.
export function mostrarEstado(blocos, status) {
  for (const [nome, bloco] of Object.entries(blocos)) {
    bloco.classList.toggle('d-none', nome !== status);
  }
}

// Texto do botão principal do formulário, nos três momentos.
export function rotuloDoSalvar({ salvando, editandoId }, textoCriar) {
  if (salvando) return 'Salvando…';
  return editandoId ? 'Salvar alterações' : textoCriar;
}

// Delegação: UM listener no <tbody> atende os botões de todas as linhas.
export function aoClicarNaLista(tbody, { editar, remover }) {
  tbody.addEventListener('click', (evento) => {
    const alvo = evento.target.closest('button[data-acao]');
    if (!alvo) return;
    const id = Number(alvo.dataset.id); // tudo que vem do DOM é string
    if (alvo.dataset.acao === 'editar') editar(id);
    if (alvo.dataset.acao === 'remover') remover(id);
  });
}
