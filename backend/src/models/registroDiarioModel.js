let registros = [];
let proximoId = 1;

export const registroDiarioModel = {
  listar() {
    return registros;
  },

  listarPorUsuario(usuarioId) {
    return registros.filter((r) => r.usuarioId === usuarioId);
  },

  buscarPorId(id) {
    return registros.find((r) => r.id === id) ?? null;
  },

  existeDataParaUsuario(usuarioId, data) {
    return registros.some((r) => r.usuarioId === usuarioId && r.data === data);
  },

  inserir({ usuarioId, data, foiAcademia, aguaConsumidaMl, duracaoSonoMinutos }) {
    const novo = {
      id: proximoId++,
      usuarioId: Number(usuarioId),
      data,
      foiAcademia: foiAcademia ?? false,
      aguaConsumidaMl: aguaConsumidaMl ?? 0,
      duracaoSonoMinutos: duracaoSonoMinutos ?? null,
    };
    registros.push(novo);
    return novo;
  },

  atualizar(id, dados) {
    const i = registros.findIndex((r) => r.id === id);
    if (i === -1) return null;
    registros[i] = { ...registros[i], ...dados, id };
    return registros[i];
  },

  remover(id) {
    const antes = registros.length;
    registros = registros.filter((r) => r.id !== id);
    return registros.length < antes;
  },
};
