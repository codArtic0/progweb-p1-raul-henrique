// Camada de UI: a única que toca no DOM dos usuários.
// Não faz fetch e não valida regra: desenha o estado e avisa dos eventos.
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

function celula(texto, classe = '') {
  const td = document.createElement('td');
  td.textContent = texto; // dado do usuário entra como TEXTO, nunca como HTML
  td.className = classe;
  return td;
}

function botao(texto, acao, id, classe) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = texto;
  b.className = `btn btn-sm ${classe}`;
  b.dataset.acao = acao;
  b.dataset.id = id;
  return b;
}

function linha(usuario, editandoId) {
  const tr = document.createElement('tr');
  if (usuario.id === editandoId) tr.className = 'editando';

  const acoes = celula('', 'text-end text-nowrap');
  acoes.append(
    botao('Editar', 'editar', usuario.id, 'btn-outline-primary me-1'),
    botao('Remover', 'remover', usuario.id, 'btn-outline-danger'),
  );

  tr.append(celula(usuario.id), celula(usuario.nome), celula(usuario.email), acoes);
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
