// Camada de UI: a única que toca no DOM dos hábitos.
// Não faz fetch e não valida regra: desenha o estado e avisa dos eventos.
import { icone } from './icones.js';
import { TIPOS } from './tipos.js';

const el = {
  form: document.querySelector('#form-habito'),
  unidade: document.querySelector('#unid-meta'),
  salvar: document.querySelector('#hab-salvar'),
  cancelar: document.querySelector('#hab-cancelar'),
  carregando: document.querySelector('#habitos-carregando'),
  erro: document.querySelector('#habitos-erro'),
  erroMsg: document.querySelector('#habitos-erro-msg'),
  recarregar: document.querySelector('#habitos-recarregar'),
  vazio: document.querySelector('#habitos-vazio'),
  sucesso: document.querySelector('#habitos-sucesso'),
  linhas: document.querySelector('#habitos-linhas'),
};

function celula(classe = '', rotulo = '') {
  const td = document.createElement('td');
  td.className = classe;
  if (rotulo) td.dataset.rotulo = rotulo; // usado pelo layout de cartões no celular
  return td;
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

function linha(habito, editandoId) {
  const tipo = TIPOS[habito.tipo];
  const tr = document.createElement('tr');
  if (habito.id === editandoId) tr.className = 'editando';

  // Hábito: ícone na cor do tipo + nome (dado do usuário entra como TEXTO)
  const chip = document.createElement('span');
  chip.className = `chip-tipo tipo-${habito.tipo}`;
  chip.append(icone(tipo.icone));
  const nome = document.createElement('span');
  nome.className = 'fw-semibold';
  nome.textContent = habito.nome;
  const rotuloTipo = document.createElement('small');
  rotuloTipo.className = 'text-body-secondary';
  rotuloTipo.textContent = tipo.rotulo;
  const textos = document.createElement('span');
  textos.className = 'd-flex flex-column';
  textos.append(nome, rotuloTipo);
  const grupo = document.createElement('span');
  grupo.className = 'd-flex align-items-center gap-3';
  grupo.append(chip, textos);
  const quem = celula('celula-principal');
  quem.append(grupo);

  const meta = celula('numero', 'Meta por dia');
  meta.textContent = `${habito.meta} ${tipo.unidade}`;

  const acoes = celula('text-end text-nowrap celula-acoes');
  acoes.append(
    botao(`Editar ${habito.nome}`, 'lapis', 'editar', habito.id, 'btn-outline-primary me-1'),
    botao(`Remover ${habito.nome}`, 'lixeira', 'remover', habito.id, 'btn-outline-danger'),
  );

  tr.append(quem, meta, acoes);
  return tr;
}

export const habitoView = {
  // Desenha a tela a partir do estado: a UI é função do estado.
  render({ status, habitos, erro, editandoId, salvando }) {
    el.carregando.classList.toggle('d-none', status !== 'carregando');
    el.erro.classList.toggle('d-none', status !== 'erro');
    el.vazio.classList.toggle('d-none', status !== 'vazio');
    el.sucesso.classList.toggle('d-none', status !== 'sucesso');

    el.erroMsg.textContent = erro ?? '';
    el.linhas.replaceChildren(...habitos.map((h) => linha(h, editandoId)));

    // O tipo define a unidade dos registros: travado durante a edição
    el.form.tipo.disabled = Boolean(editandoId);

    el.salvar.disabled = salvando;
    el.salvar.textContent = salvando
      ? 'Salvando…'
      : editandoId ? 'Salvar alterações' : 'Cadastrar hábito';
    el.cancelar.classList.toggle('d-none', !editandoId);
  },

  preencherForm(habito) {
    el.form.nome.value = habito.nome;
    el.form.tipo.value = habito.tipo;
    el.form.meta.value = habito.meta;
    el.unidade.textContent = TIPOS[habito.tipo].unidade;
    el.form.nome.focus();
  },

  limparForm() {
    el.form.reset();
    el.unidade.textContent = TIPOS[el.form.tipo.value].unidade;
  },

  // --- Eventos: a view avisa; quem decide o que fazer é o main.js ---
  aoEnviar(fn) {
    el.form.addEventListener('submit', (evento) => {
      evento.preventDefault(); // sem isto, o navegador recarrega a página
      // select desabilitado não entra no FormData: o tipo vai direto do campo
      fn({ ...Object.fromEntries(new FormData(el.form)), tipo: el.form.tipo.value });
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

// A unidade ao lado da meta acompanha o tipo escolhido
el.form.tipo.addEventListener('change', () => {
  el.unidade.textContent = TIPOS[el.form.tipo.value].unidade;
});
