// Tema claro/escuro. A escolha fica no localStorage (só preferência visual).
import { icone } from './icones.js';

const raiz = document.documentElement;
const botao = document.querySelector('#alternar-tema');

function desenharBotao() {
  const escuro = raiz.dataset.bsTheme === 'dark';
  botao.replaceChildren(icone(escuro ? 'sol' : 'lua'));
  botao.title = escuro ? 'Mudar para o tema claro' : 'Mudar para o tema escuro';
}

botao.addEventListener('click', () => {
  const novo = raiz.dataset.bsTheme === 'dark' ? 'light' : 'dark';
  raiz.dataset.bsTheme = novo;
  try { localStorage.setItem('tema', novo); } catch { /* sem armazenamento: vale só nesta visita */ }
  desenharBotao();
});

desenharBotao();
