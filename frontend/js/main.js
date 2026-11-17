// Ponto de entrada: liga store, service e view. Nenhuma regra mora aqui.
import { criarStore } from './state/store.js';
import { usuarioService } from './services/usuarioService.js';
import { registroService } from './services/registroService.js';
import { usuarioView } from './ui/usuarioView.js';
import { registroView } from './ui/registroView.js';
import { aviso } from './ui/aviso.js';

// ===================== USUÁRIOS =====================
const usuarios = criarStore({
  status: 'carregando', // 'carregando' | 'erro' | 'vazio' | 'sucesso'
  usuarios: [],
  erro: null,
  editandoId: null,
  salvando: false,
});

// Toda vez que o estado mudar, a view redesenha.
usuarios.assinar(usuarioView.render);

async function carregarUsuarios() {
  usuarios.set({ status: 'carregando', erro: null });
  try {
    const lista = await usuarioService.listar();
    usuarios.set({ status: lista.length ? 'sucesso' : 'vazio', usuarios: lista });
  } catch (e) {
    usuarios.set({ status: 'erro', erro: e.message });
  }
}

async function salvarUsuario(dados) {
  const { editandoId } = usuarios.get();
  aviso.limpar();
  usuarios.set({ salvando: true });
  try {
    if (editandoId) await usuarioService.atualizar(editandoId, dados);
    else await usuarioService.criar(dados);

    aviso.sucesso(editandoId ? 'Usuário atualizado.' : 'Usuário cadastrado.');
    usuarioView.limparForm();
    usuarios.set({ editandoId: null });
    await carregarUsuarios();
  } catch (e) {
    aviso.erro(e.message); // o formulário fica como está, para corrigir
  } finally {
    usuarios.set({ salvando: false });
  }
}

function editarUsuario(id) {
  const usuario = usuarios.get().usuarios.find((u) => u.id === id);
  usuarioView.preencherForm(usuario);
  usuarios.set({ editandoId: id });
}

function cancelarEdicaoUsuario() {
  usuarioView.limparForm();
  usuarios.set({ editandoId: null });
}

async function removerUsuario(id) {
  if (!confirm(`Remover o usuário #${id}?`)) return;
  aviso.limpar();
  try {
    await usuarioService.remover(id);
    aviso.sucesso('Usuário removido.');
    if (usuarios.get().editandoId === id) cancelarEdicaoUsuario();
    await carregarUsuarios();
  } catch (e) {
    aviso.erro(e.message);
  }
}

usuarioView.aoEnviar(salvarUsuario);
usuarioView.aoCancelar(cancelarEdicaoUsuario);
usuarioView.aoRecarregar(carregarUsuarios);
usuarioView.aoClicarNaLista({ editar: editarUsuario, remover: removerUsuario });

// ===================== REGISTROS DIÁRIOS =====================
const registros = criarStore({
  status: 'carregando',
  registros: [],
  erro: null,
  editandoId: null,
  salvando: false,
});

registros.assinar(registroView.render);

// Os registros dependem dos usuários: mudou a lista de usuários,
// refaz o <select> e redesenha os nomes na tabela de registros.
usuarios.assinar((estado) => {
  registroView.preencherUsuarios(estado.usuarios);
  registroView.render(registros.get());
});

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
    aviso.erro(e.message); // ex.: 400 valor inválido, 409 data repetida, 422 usuário inexistente
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

// ===================== INÍCIO =====================
carregarUsuarios();
carregarRegistros();
