// Camada de UI dos registros. Mesmo molde da habitoView, com um <select> a mais.
import { icone } from './icones.js';
import { TIPOS, formatarValor } from './tipos.js';
import { celula, celulaDeAcoes, mostrarEstado, rotuloDoSalvar, aoClicarNaLista } from './dom.js';
import { formatarData, hoje } from '../utils/datas.js';

const el = {
  form: document.querySelector('#form-registro'),
  habito: document.querySelector('#reg-habito'),
  unidade: document.querySelector('#unid-valor'),
  ajuda: document.querySelector('#ajuda-valor'),
  salvar: document.querySelector('#reg-salvar'),
  cancelar: document.querySelector('#reg-cancelar'),
  carregando: document.querySelector('#registros-carregando'),
  erro: document.querySelector('#registros-erro'),
  erroMsg: document.querySelector('#registros-erro-msg'),
  recarregar: document.querySelector('#registros-recarregar'),
  vazio: document.querySelector('#registros-vazio'),
  sucesso: document.querySelector('#registros-sucesso'),
  linhas: document.querySelector('#registros-linhas'),
};

// id → hábito, para mostrar unidade e meta no formulário
let habitosPorId = new Map();

function linha(registro, editandoId) {
  const { habito } = registro;
  const tr = document.createElement('tr');
  if (registro.id === editandoId) tr.className = 'editando';

  // Quando
  const quando = celula('celula-principal numero fw-semibold text-nowrap');
  quando.textContent = formatarData(registro.data);

  // Hábito: ícone na cor do tipo + nome
  const qual = celula('', 'Hábito');
  if (habito) {
    const chip = document.createElement('span');
    chip.className = `chip-tipo chip-pequeno tipo-${habito.tipo}`;
    chip.append(icone(TIPOS[habito.tipo].icone));
    const nome = document.createElement('span');
    nome.textContent = habito.nome;
    const grupo = document.createElement('span');
    grupo.className = 'd-flex align-items-center gap-2';
    grupo.append(chip, nome);
    qual.append(grupo);
  } else {
    qual.textContent = `hábito #${registro.habitoId} (removido)`; // registro órfão
  }

  // Progresso: valor, meta e barra na cor do tipo
  const progresso = celula('', 'Progresso');
  if (habito) {
    const topo = document.createElement('span');
    topo.className = 'd-flex align-items-center gap-2 numero';
    topo.append(document.createTextNode(
      `${formatarValor(habito.tipo, registro.valor)} de ${formatarValor(habito.tipo, habito.meta)}`,
    ));
    if (registro.atingiu) {
      const selo = document.createElement('span');
      selo.className = 'selo selo-ok';
      selo.append(icone('ok'), document.createTextNode('Meta batida'));
      topo.append(selo);
    }
    const barra = document.createElement('div');
    barra.className = `progress barra-habito tipo-${habito.tipo}`;
    barra.setAttribute('role', 'progressbar');
    barra.setAttribute('aria-label', `Progresso da meta de ${habito.nome}`);
    barra.setAttribute('aria-valuenow', registro.pct);
    barra.setAttribute('aria-valuemin', '0');
    barra.setAttribute('aria-valuemax', '100');
    const preenchida = document.createElement('div');
    preenchida.className = 'progress-bar';
    preenchida.style.width = `${registro.pct}%`;
    barra.append(preenchida);
    progresso.append(topo, barra);
  } else {
    progresso.textContent = String(registro.valor);
  }

  const nomeDoDia = `registro de ${formatarData(registro.data)}`;
  tr.append(quando, qual, progresso, celulaDeAcoes(registro.id, nomeDoDia));
  return tr;
}

// Unidade e meta do hábito escolhido, ao lado do campo de valor
function atualizarUnidade() {
  const habito = habitosPorId.get(Number(el.habito.value));
  if (!habito) {
    el.unidade.textContent = '—';
    el.ajuda.textContent = 'Escolha um hábito para ver a unidade e a meta.';
    return;
  }
  el.unidade.textContent = TIPOS[habito.tipo].unidade;
  el.ajuda.textContent = `Meta de ${habito.nome}: ${formatarValor(habito.tipo, habito.meta)} por dia.`;
}

export const registroView = {
  // Preenche o <select> com os hábitos que existem agora
  preencherHabitos(habitos) {
    habitosPorId = new Map(habitos.map((h) => [h.id, h]));
    const escolhido = el.habito.value;

    const opcoes = habitos.map((h) => new Option(h.nome, h.id));
    el.habito.replaceChildren(new Option('Selecione…', ''), ...opcoes);

    // mantém a escolha, se o hábito ainda existir
    if (habitosPorId.has(Number(escolhido))) el.habito.value = escolhido;
    atualizarUnidade();
  },

  render({ status, registros, erro, editandoId, salvando }) {
    mostrarEstado({ carregando: el.carregando, erro: el.erro, vazio: el.vazio, sucesso: el.sucesso }, status);

    el.erroMsg.textContent = erro ?? '';
    el.linhas.replaceChildren(...registros.map((r) => linha(r, editandoId)));

    // O backend não deixa mudar hábito nem data: travados durante a edição
    el.form.habitoId.disabled = Boolean(editandoId);
    el.form.data.disabled = Boolean(editandoId);

    el.salvar.disabled = salvando;
    el.salvar.textContent = rotuloDoSalvar({ salvando, editandoId }, 'Registrar');
    el.cancelar.classList.toggle('d-none', !editandoId);
  },

  preencherForm(registro) {
    el.form.habitoId.value = registro.habitoId;
    el.form.data.value = registro.data;
    el.form.valor.value = registro.valor;
    atualizarUnidade();
    el.form.valor.focus();
  },

  limparForm() {
    el.form.reset();
    el.form.data.value = hoje();
    atualizarUnidade();
  },

  aoEnviar(fn) {
    el.form.addEventListener('submit', (evento) => {
      evento.preventDefault();
      // campos desabilitados (edição) não entram no FormData: a edição só usa o valor
      fn(Object.fromEntries(new FormData(el.form)));
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

el.habito.addEventListener('change', atualizarUnidade);
el.form.data.value = hoje(); // a data começa em hoje
