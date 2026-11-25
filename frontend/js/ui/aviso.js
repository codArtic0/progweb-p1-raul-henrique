// Mensagem flutuante: resultado das ações (criar, editar, remover).
// Sucesso some sozinho; erro fica até a próxima ação, para dar tempo de ler.
const caixa = document.querySelector('#aviso');
let temporizador = null;

function mostrar(tipo, texto) {
  clearTimeout(temporizador);
  caixa.className = `alert alert-${tipo} aviso-flutuante`;
  caixa.setAttribute('role', tipo === 'danger' ? 'alert' : 'status');
  caixa.textContent = texto; // textContent: nunca interpreta HTML
  if (tipo === 'success') temporizador = setTimeout(limpar, 4000);
}

function limpar() {
  clearTimeout(temporizador);
  caixa.className = 'alert d-none aviso-flutuante';
  caixa.textContent = '';
}

export const aviso = {
  sucesso: (texto) => mostrar('success', texto),
  erro: (texto) => mostrar('danger', texto),
  limpar,
};
