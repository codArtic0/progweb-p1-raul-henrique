import { registroDiarioModel } from '../models/registroDiarioModel.js';
import { usuarioModel } from '../models/usuarioModel.js';
import { erro } from '../utils/erro.js';

const FORMATO_DATA = /^\d{4}-\d{2}-\d{2}$/;

function validarCampos({ data, foiAcademia, aguaConsumidaMl, duracaoSonoMinutos }) {
  if (data !== undefined) {
    if (!FORMATO_DATA.test(data) || Number.isNaN(Date.parse(data))) {
      throw erro(400, 'Campo "data" deve estar no formato AAAA-MM-DD');
    }
  }
  if (foiAcademia !== undefined && typeof foiAcademia !== 'boolean') {
    throw erro(400, 'Campo "foiAcademia" deve ser true ou false');
  }
  if (aguaConsumidaMl !== undefined && (typeof aguaConsumidaMl !== 'number' || aguaConsumidaMl < 0)) {
    throw erro(400, 'Campo "aguaConsumidaMl" deve ser um número maior ou igual a 0');
  }
  if (
    duracaoSonoMinutos !== undefined &&
    (typeof duracaoSonoMinutos !== 'number' || duracaoSonoMinutos < 0 || duracaoSonoMinutos > 1440)
  ) {
    throw erro(400, 'Campo "duracaoSonoMinutos" deve ser um número entre 0 e 1440');
  }
}

export const registroDiarioService = {
  listar(usuarioId) {
    if (usuarioId) return registroDiarioModel.listarPorUsuario(Number(usuarioId));
    return registroDiarioModel.listar();
  },

  buscarPorId(id) {
    const registro = registroDiarioModel.buscarPorId(id);
    if (!registro) throw erro(404, 'Registro diário não encontrado');
    return registro;
  },

  criar(dados = {}) {
    const { usuarioId, data } = dados;
    // Regra 1: usuarioId e data são obrigatórios
    if (!usuarioId || !data) throw erro(400, 'Campos "usuarioId" e "data" são obrigatórios');
    // Regra 2: valores válidos (data, água >= 0, sono entre 0 e 24h)
    validarCampos(dados);
    // Regra 3: o usuário precisa existir
    if (!usuarioModel.buscarPorId(Number(usuarioId))) throw erro(422, 'Usuário informado não existe');
    // Regra 4: no máximo um registro por usuário por data
    if (registroDiarioModel.existeDataParaUsuario(Number(usuarioId), data)) {
      throw erro(409, 'Já existe um registro deste usuário para esta data');
    }
    return registroDiarioModel.inserir(dados);
  },

  atualizar(id, dados = {}) {
    // usuarioId e data não mudam depois de criados
    const { foiAcademia, aguaConsumidaMl, duracaoSonoMinutos } = dados;
    const campos = { foiAcademia, aguaConsumidaMl, duracaoSonoMinutos };
    validarCampos(campos);
    for (const chave of Object.keys(campos)) {
      if (campos[chave] === undefined) delete campos[chave];
    }
    const atualizado = registroDiarioModel.atualizar(id, campos);
    if (!atualizado) throw erro(404, 'Registro diário não encontrado');
    return atualizado;
  },

  remover(id) {
    const removido = registroDiarioModel.remover(id);
    if (!removido) throw erro(404, 'Registro diário não encontrado');
  },
};
