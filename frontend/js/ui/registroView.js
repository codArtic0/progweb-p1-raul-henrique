// Camada de UI dos registros diários. Mesmo molde da usuarioView, com um <select> a mais.
import { icone } from './icones.js';

const el = {
  form: document.querySelector('#form-registro'),
  usuario: document.querySelector('#reg-usuario'),
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

// id → nome, para mostrar o dono do registro sem outra requisição
let nomeDoUsuario = new Map();

// '2026-11-17' → '17/11/2026' (sem Date: evita o deslocamento de fuso horário)
function formatarData(data) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

function formatarSono(minutos) {
  if (minutos == null) return '—';
  return `${Math.floor(minutos / 60)}h${String(minutos % 60).padStart(2, '0')}`;
}

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

// Selo (badge) com ícone e texto: a informação nunca depende só da cor.
function selo(nomeIcone, texto, classe) {
  const s = document.createElement('span');
  s.className = `selo ${classe}`;
  s.append(icone(nomeIcone), document.createTextNode(texto));
  return s;
}

const ROTULO_SONO = { baixo: 'abaixo do ideal', ideal: 'no ideal', alto: 'acima do ideal' };

function linha(registro, editandoId) {
  const tr = document.createElement('tr');
  if (registro.id === editandoId) tr.className = 'editando';

  const dono = nomeDoUsuario.get(registro.usuarioId)
    ?? `usuário #${registro.usuarioId} (removido)`; // registro órfão: assunto da S5

  // Quando: data em destaque e o dono embaixo
  const quando = celula('celula-principal');
  const data = document.createElement('span');
  data.className = 'fw-semibold numero d-block';
  data.textContent = formatarData(registro.data);
  const quem = document.createElement('small');
  quem.className = 'text-body-secondary';
  quem.textContent = dono;
  quando.append(data, quem);

  // Treino: selo com ícone
  const treino = celula('', 'Treino');
  treino.append(registro.foiAcademia
    ? selo('halter', 'Treinou', 'selo-treino')
    : selo('calendario', 'Descanso', 'selo-neutro'));

  // Água: valor + barra de progresso da meta
  const agua = celula('', 'Água');
  const valor = document.createElement('span');
  valor.className = 'numero d-block';
  valor.textContent = `${registro.aguaConsumidaMl} ml`;
  const barra = document.createElement('div');
  barra.className = 'progress barra-agua';
  barra.setAttribute('role', 'progressbar');
  barra.setAttribute('aria-label', 'Meta de água do dia');
  barra.setAttribute('aria-valuenow', registro.aguaPct);
  barra.setAttribute('aria-valuemin', '0');
  barra.setAttribute('aria-valuemax', '100');
  const preenchida = document.createElement('div');
  preenchida.className = 'progress-bar';
  preenchida.style.width = `${registro.aguaPct}%`;
  barra.append(preenchida);
  agua.append(valor, barra);

  // Sono: selo colorido pela faixa, com a leitura por extenso
  const sono = celula('', 'Sono');
  if (registro.sonoFaixa) {
    sono.append(selo('lua', formatarSono(registro.duracaoSonoMinutos), `selo-sono-${registro.sonoFaixa}`));
    sono.title = ROTULO_SONO[registro.sonoFaixa];
  } else {
    sono.textContent = '—';
  }

  const acoes = celula('text-end text-nowrap celula-acoes');
  acoes.append(
    botao(`Editar registro de ${formatarData(registro.data)}`, 'lapis', 'editar', registro.id, 'btn-outline-primary me-1'),
    botao(`Remover registro de ${formatarData(registro.data)}`, 'lixeira', 'remover', registro.id, 'btn-outline-danger'),
  );

  tr.append(quando, treino, agua, sono, acoes);
  return tr;
}

export const registroView = {
  // Preenche o <select> com os usuários que existem agora
  preencherUsuarios(usuarios) {
    nomeDoUsuario = new Map(usuarios.map((u) => [u.id, u.nome]));
    const escolhido = el.usuario.value;

    const opcoes = usuarios.map((u) => new Option(`${u.nome} (#${u.id})`, u.id));
    el.usuario.replaceChildren(new Option('Selecione…', ''), ...opcoes);

    // mantém a escolha, se o usuário ainda existir
    if (nomeDoUsuario.has(Number(escolhido))) el.usuario.value = escolhido;
  },

  render({ status, registros, erro, editandoId, salvando }) {
    el.carregando.classList.toggle('d-none', status !== 'carregando');
    el.erro.classList.toggle('d-none', status !== 'erro');
    el.vazio.classList.toggle('d-none', status !== 'vazio');
    el.sucesso.classList.toggle('d-none', status !== 'sucesso');

    el.erroMsg.textContent = erro ?? '';
    el.linhas.replaceChildren(...registros.map((r) => linha(r, editandoId)));

    // O backend não deixa mudar usuário nem data: travados durante a edição
    el.form.usuarioId.disabled = Boolean(editandoId);
    el.form.data.disabled = Boolean(editandoId);

    el.salvar.disabled = salvando;
    el.salvar.textContent = salvando
      ? 'Salvando…'
      : editandoId ? 'Salvar alterações' : 'Registrar dia';
    el.cancelar.classList.toggle('d-none', !editandoId);
  },

  preencherForm(registro) {
    el.form.usuarioId.value = registro.usuarioId;
    el.form.data.value = registro.data;
    el.form.foiAcademia.checked = registro.foiAcademia;
    el.form.aguaConsumidaMl.value = registro.aguaConsumidaMl;
    el.form.duracaoSonoMinutos.value = registro.duracaoSonoMinutos ?? '';
    el.form.aguaConsumidaMl.focus();
  },

  limparForm() {
    el.form.reset();
  },

  aoEnviar(fn) {
    el.form.addEventListener('submit', (evento) => {
      evento.preventDefault();
      fn(Object.fromEntries(new FormData(el.form)));
    });
  },

  aoCancelar(fn) {
    el.cancelar.addEventListener('click', fn);
  },

  aoRecarregar(fn) {
    el.recarregar.addEventListener('click', fn);
  },

  aoClicarNaLista({ editar, remover }) {
    el.linhas.addEventListener('click', (evento) => {
      const alvo = evento.target.closest('button[data-acao]');
      if (!alvo) return;
      const id = Number(alvo.dataset.id);
      if (alvo.dataset.acao === 'editar') editar(id);
      if (alvo.dataset.acao === 'remover') remover(id);
    });
  },
};
