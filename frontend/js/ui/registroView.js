// Camada de UI dos registros diários. Mesmo molde da usuarioView, com um <select> a mais.
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

function celula(texto, classe = '') {
  const td = document.createElement('td');
  td.textContent = texto;
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

function linha(registro, editandoId) {
  const tr = document.createElement('tr');
  if (registro.id === editandoId) tr.className = 'editando';

  const dono = nomeDoUsuario.get(registro.usuarioId)
    ?? `usuário #${registro.usuarioId} (removido)`; // registro órfão: assunto da S5

  const acoes = celula('', 'text-end text-nowrap');
  acoes.append(
    botao('Editar', 'editar', registro.id, 'btn-outline-primary me-1'),
    botao('Remover', 'remover', registro.id, 'btn-outline-danger'),
  );

  tr.append(
    celula(registro.id),
    celula(dono),
    celula(formatarData(registro.data), 'numero text-nowrap'),
    celula(registro.foiAcademia ? 'Sim' : 'Não'),
    celula(`${registro.aguaConsumidaMl} ml`, 'numero text-end text-nowrap'),
    celula(formatarSono(registro.duracaoSonoMinutos), 'numero text-end text-nowrap'),
    acoes,
  );
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
