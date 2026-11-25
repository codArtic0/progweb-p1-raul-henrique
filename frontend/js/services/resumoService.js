// Regras do resumo: números derivados das duas listas. Função pura, fácil de testar.
const media = (valores) =>
  valores.length ? valores.reduce((soma, v) => soma + v, 0) / valores.length : null;

export function calcularResumo(usuarios, registros) {
  return {
    usuarios: usuarios.length,
    treinos: registros.filter((r) => r.foiAcademia).length,
    mediaAguaMl: media(registros.map((r) => r.aguaConsumidaMl)),
    mediaSonoMin: media(
      registros.map((r) => r.duracaoSonoMinutos).filter((m) => m != null),
    ),
  };
}
