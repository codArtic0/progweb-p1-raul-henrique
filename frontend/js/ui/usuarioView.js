// Camada de UI: a única que toca no DOM dos usuários.
// Não faz fetch e não valida regra: desenha o estado e avisa dos eventos.
import { icone } from './icones.js';

const el = {
  form: document.querySelector('#form-usuario'),
  salvar: document.querySelector('#usu-salvar'),
  cancelar: document.querySelector('#usu-cancelar'),
  carregando: document.querySelector('#usuarios-carregando'),
  erro: document.querySelector('#usuarios-erro'),
  erroMsg: document.querySelector('#usuarios-erro-msg'),
  recarregar: document.querySelector('#usuarios-recarregar'),
  vazio: document.querySelector('#usuarios-vazio'),
  sucesso: document.querySelector('#usuarios-sucesso'),
  linhas: document.querySelector('#usuarios-linhas'),
};

function celula(classe = '', rotulo = '') {
  const td = document.createElement('td');
  td.className = classe;
  if (rotulo) td.dataset.rotulo = rotulo; // usado pelo layout de cartões no celular
  return td;
}

// Iniciais do nome: "Ana Lima" → "AL"
function iniciais(nome) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? '?';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

function avatar(usuario) {
  const a = document.createElement('span');
  a.className = `avatar avatar-${usuario.id % 5}`; // cor estável por usuário
  a.textContent = iniciais(usuario.nome);
  a.setAttribute('aria-hidden', 'true');
  return a;
}

function botao(rotulo, nomeIcone, acao, id, classe) {
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

function linha(usuario, editandoId) {
  const tr = document.createElement('tr');
  if (usuario.id === editandoId) tr.className = 'editando';

  // Nome (dado do usuário) entra como TEXTO, nunca como HTML
  const quem = celula('celula-principal');
  const nome = document.createElement('span');
  nome.className = 'fw-semibold';
  nome.textContent = usuario.nome;
  const id = document.createElement('small');
  id.className = 'text-body-secondary numero';
  id.textContent = `#${usuario.id}`;
  const bloco = document.createElement('span');
  bloco.className = 'd-flex flex-column';
  bloco.append(nome, id);
  const grupo = document.createElement('span');
  grupo.className = 'd-flex align-items-center gap-3';
  grupo.append(avatar(usuario), bloco);
  quem.append(grupo);

  const email = celula('text-break', 'E-mail');
  email.textContent = usuario.email;

  const acoes = celula('text-end text-nowrap celula-acoes');
  acoes.append(
    botao(`Editar ${usuario.nome}`, 'lapis', 'editar', usuario.id, 'btn-outline-primary me-1'),
    botao(`Remover ${usuario.nome}`, 'lixeira', 'remover', usuario.id, 'btn-outline-danger'),
  );

  tr.append(quem, email, acoes);
  return tr;
}

export const usuarioView = {
  // Desenha a tela a partir do estado: a UI é função do estado.
  render({ status, usuarios, erro, editandoId, salvando }) {
    el.carregando.classList.toggle('d-none', status !== 'carregando');
    el.erro.classList.toggle('d-none', status !== 'erro');
    el.vazio.classList.toggle('d-none', status !== 'vazio');
    el.sucesso.classList.toggle('d-none', status !== 'sucesso');

    el.erroMsg.textContent = erro ?? '';
    el.linhas.replaceChildren(...usuarios.map((u) => linha(u, editandoId)));

    el.salvar.disabled = salvando;
    el.salvar.textContent = salvando
      ? 'Salvando…'
      : editandoId ? 'Salvar alterações' : 'Cadastrar usuário';
    el.cancelar.classList.toggle('d-none', !editandoId);
  },

  preencherForm(usuario) {
    el.form.nome.value = usuario.nome;
    el.form.email.value = usuario.email;
    el.form.nome.focus();
  },

  limparForm() {
    el.form.reset();
  },

  // --- Eventos: a view avisa; quem decide o que fazer é o main.js ---
  aoEnviar(fn) {
    el.form.addEventListener('submit', (evento) => {
      evento.preventDefault(); // sem isto, o navegador recarrega a página
      fn(Object.fromEntries(new FormData(el.form)));
    });
  },

  aoCancelar(fn) {
    el.cancelar.addEventListener('click', fn);
  },

  aoRecarregar(fn) {
    el.recarregar.addEventListener('click', fn);
  },

  // Delegação: UM listener no <tbody> atende os botões de todas as linhas.
  aoClicarNaLista({ editar, remover }) {
    el.linhas.addEventListener('click', (evento) => {
      const alvo = evento.target.closest('button[data-acao]');
      if (!alvo) return;
      const id = Number(alvo.dataset.id); // tudo que vem do DOM é string
      if (alvo.dataset.acao === 'editar') editar(id);
      if (alvo.dataset.acao === 'remover') remover(id);
    });
  },
};
