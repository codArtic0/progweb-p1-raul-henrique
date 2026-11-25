// Camada de UI: a única que toca no DOM dos hábitos.
// Não faz fetch e não valida regra: desenha o estado e avisa dos eventos.
import { icone } from './icones.js';
import { TIPOS } from './tipos.js';
import { celula, celulaDeAcoes, mostrarEstado, rotuloDoSalvar, aoClicarNaLista } from './dom.js';

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

  tr.append(quem, meta, celulaDeAcoes(habito.id, habito.nome));
  return tr;
}

export const habitoView = {
  // Desenha a tela a partir do estado: a UI é função do estado.
  render({ status, habitos, erro, editandoId, salvando }) {
    mostrarEstado({ carregando: el.carregando, erro: el.erro, vazio: el.vazio, sucesso: el.sucesso }, status);

    el.erroMsg.textContent = erro ?? '';
    el.linhas.replaceChildren(...habitos.map((h) => linha(h, editandoId)));

    // O tipo define a unidade dos registros: travado durante a edição
    el.form.tipo.disabled = Boolean(editandoId);

    el.salvar.disabled = salvando;
    el.salvar.textContent = rotuloDoSalvar({ salvando, editandoId }, 'Cadastrar hábito');
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

  aoClicarNaLista(acoes) {
    aoClicarNaLista(el.linhas, acoes);
  },
};

// A unidade ao lado da meta acompanha o tipo escolhido
el.form.tipo.addEventListener('change', () => {
  el.unidade.textContent = TIPOS[el.form.tipo.value].unidade;
});
