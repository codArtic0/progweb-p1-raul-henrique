// Camada de UI do resumo: só desenha os números.
const el = {
  sequencia: document.querySelector('#res-sequencia'),
  metas: document.querySelector('#res-metas'),
  metasRotulo: document.querySelector('#res-metas-rotulo'),
  habitos: document.querySelector('#res-habitos'),
  registros: document.querySelector('#res-registros'),
};

const SEM_DADO = '—';

export const resumoView = {
  // resumo = null enquanto os dados não chegaram (carregando ou erro)
  render(resumo) {
    el.sequencia.textContent = resumo ? resumo.sequencia : SEM_DADO;
    el.habitos.textContent = resumo ? resumo.habitos : SEM_DADO;
    el.registros.textContent = resumo ? resumo.registros : SEM_DADO;
    el.metas.textContent = resumo && resumo.percentualMetas !== null
      ? `${resumo.percentualMetas}%` : SEM_DADO;
    el.metasRotulo.textContent = resumo
      ? `${resumo.metasBatidas} de ${resumo.registros} registros` : 'dos registros';
  },
};
