// Ponto de entrada: liga store, service e view. Nenhuma regra mora aqui.
import { criarStore } from './state/store.js';
import { habitoService } from './services/habitoService.js';
import { registroService, enriquecer } from './services/registroService.js';
import { calcularResumo, hojePorHabito, ultimosDias } from './services/resumoService.js';
import { habitoView } from './ui/habitoView.js';
import { registroView } from './ui/registroView.js';
import { resumoView } from './ui/resumoView.js';
import { hojeView } from './ui/hojeView.js';
import { hidratarIcones } from './ui/icones.js';
import './ui/tema.js'; // liga o botão de tema claro/escuro
import { aviso } from './ui/aviso.js';

hidratarIcones(); // troca os data-icone do HTML pelos SVGs

// ===================== HÁBITOS =====================
const habitos = criarStore({
  status: 'carregando', // 'carregando' | 'erro' | 'vazio' | 'sucesso'
  habitos: [],
  erro: null,
  editandoId: null,
  salvando: false,
});

// Toda vez que o estado mudar, a view redesenha.
habitos.assinar(habitoView.render);

async function carregarHabitos() {
  habitos.set({ status: 'carregando', erro: null });
  try {
    const lista = await habitoService.listar();
    habitos.set({ status: lista.length ? 'sucesso' : 'vazio', habitos: lista });
  } catch (e) {
    habitos.set({ status: 'erro', erro: e.message });
  }
}

async function salvarHabito(dados) {
  const { editandoId } = habitos.get();
  aviso.limpar();
  habitos.set({ salvando: true });
  try {
    if (editandoId) await habitoService.atualizar(editandoId, dados);
    else await habitoService.criar(dados);

    aviso.sucesso(editandoId ? 'Hábito atualizado.' : 'Hábito cadastrado.');
    habitoView.limparForm();
    habitos.set({ editandoId: null });
    await carregarHabitos();
  } catch (e) {
    aviso.erro(e.message); // o formulário fica como está, para corrigir
  } finally {
    habitos.set({ salvando: false });
  }
}

function editarHabito(id) {
  const habito = habitos.get().habitos.find((h) => h.id === id);
  habitoView.preencherForm(habito);
  habitos.set({ editandoId: id });
}

function cancelarEdicaoHabito() {
  habitoView.limparForm();
  habitos.set({ editandoId: null });
}

async function removerHabito(id) {
  if (!confirm(`Remover o hábito #${id}?`)) return;
  aviso.limpar();
  try {
    await habitoService.remover(id);
    aviso.sucesso('Hábito removido.');
    if (habitos.get().editandoId === id) cancelarEdicaoHabito();
    await carregarHabitos();
  } catch (e) {
    aviso.erro(e.message); // ex.: 409 hábito com registros
  }
}

habitoView.aoEnviar(salvarHabito);
habitoView.aoCancelar(cancelarEdicaoHabito);
habitoView.aoRecarregar(carregarHabitos);
habitoView.aoClicarNaLista({ editar: editarHabito, remover: removerHabito });

// ===================== REGISTROS =====================
const registros = criarStore({
  status: 'carregando',
  registros: [],
  erro: null,
  editandoId: null,
  salvando: false,
});

// Os registros dependem dos hábitos: mudou um dos dois, refaz o <select>
// e redesenha a tabela com o nome, a meta e o progresso de cada registro.
function desenharRegistros() {
  const h = habitos.get();
  const r = registros.get();
  registroView.preencherHabitos(h.habitos);
  registroView.render({ ...r, registros: enriquecer(r.registros, h.habitos) });
}
habitos.assinar(desenharRegistros);
registros.assinar(desenharRegistros);

async function carregarRegistros() {
  registros.set({ status: 'carregando', erro: null });
  try {
    const lista = await registroService.listar();
    registros.set({ status: lista.length ? 'sucesso' : 'vazio', registros: lista });
  } catch (e) {
    registros.set({ status: 'erro', erro: e.message });
  }
}

async function salvarRegistro(dados) {
  const { editandoId } = registros.get();
  aviso.limpar();
  registros.set({ salvando: true });
  try {
    if (editandoId) await registroService.atualizar(editandoId, dados);
    else await registroService.criar(dados);

    aviso.sucesso(editandoId ? 'Registro atualizado.' : 'Registro cadastrado.');
    registroView.limparForm();
    registros.set({ editandoId: null });
    await carregarRegistros();
  } catch (e) {
    aviso.erro(e.message); // ex.: 400 valor inválido, 409 dia repetido, 422 hábito inexistente
  } finally {
    registros.set({ salvando: false });
  }
}

function editarRegistro(id) {
  const registro = registros.get().registros.find((r) => r.id === id);
  registroView.preencherForm(registro);
  registros.set({ editandoId: id });
}

function cancelarEdicaoRegistro() {
  registroView.limparForm();
  registros.set({ editandoId: null });
}

async function removerRegistro(id) {
  if (!confirm(`Remover o registro #${id}?`)) return;
  aviso.limpar();
  try {
    await registroService.remover(id);
    aviso.sucesso('Registro removido.');
    if (registros.get().editandoId === id) cancelarEdicaoRegistro();
    await carregarRegistros();
  } catch (e) {
    aviso.erro(e.message);
  }
}

registroView.aoEnviar(salvarRegistro);
registroView.aoCancelar(cancelarEdicaoRegistro);
registroView.aoRecarregar(carregarRegistros);
registroView.aoClicarNaLista({ editar: editarRegistro, remover: removerRegistro });

// ===================== RESUMO =====================
// Deriva dos dois stores: só mostra números quando as duas listas chegaram.
function atualizarResumo() {
  const h = habitos.get();
  const r = registros.get();
  const pronto = ['sucesso', 'vazio'].includes(h.status) && ['sucesso', 'vazio'].includes(r.status);
  if (!pronto) {
    resumoView.render(null);
    hojeView.render(null);
    return;
  }
  const lista = enriquecer(r.registros, h.habitos);
  resumoView.render(calcularResumo(h.habitos, lista));
  hojeView.render({
    cartoes: hojePorHabito(h.habitos, lista),
    dias: ultimosDias(h.habitos, lista),
  });
}
habitos.assinar(atualizarResumo);
registros.assinar(atualizarResumo);

// Painel "Hoje": registrar um hábito novo (preenche o formulário) ou ajustar o de hoje
hojeView.aoClicar({
  registrar: (habitoId) => {
    registros.set({ editandoId: null });
    registroView.prepararNovo(habitoId);
  },
  ajustar: (registroId) => {
    editarRegistro(registroId);
    document.querySelector('#form-registro').scrollIntoView({ behavior: 'smooth', block: 'center' });
  },
});

// ===================== INÍCIO =====================
carregarHabitos();
carregarRegistros();
