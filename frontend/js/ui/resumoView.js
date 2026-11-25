// Camada de UI do resumo: só desenha os quatro números.
const el = {
  usuarios: document.querySelector('#res-usuarios'),
  treinos: document.querySelector('#res-treinos'),
  agua: document.querySelector('#res-agua'),
  sono: document.querySelector('#res-sono'),
};

const SEM_DADO = '—';

function formatarAgua(ml) {
  if (ml == null) return SEM_DADO;
  return `${(ml / 1000).toFixed(1).replace('.', ',')} L`;
}

function formatarSono(min) {
  if (min == null) return SEM_DADO;
  const total = Math.round(min);
  return `${Math.floor(total / 60)}h${String(total % 60).padStart(2, '0')}`;
}

export const resumoView = {
  // resumo = null enquanto os dados não chegaram (carregando ou erro)
  render(resumo) {
    el.usuarios.textContent = resumo ? resumo.usuarios : SEM_DADO;
    el.treinos.textContent = resumo ? resumo.treinos : SEM_DADO;
    el.agua.textContent = resumo ? formatarAgua(resumo.mediaAguaMl) : SEM_DADO;
    el.sono.textContent = resumo ? formatarSono(resumo.mediaSonoMin) : SEM_DADO;
  },
};
