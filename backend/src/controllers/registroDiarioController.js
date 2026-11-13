import { registroDiarioService } from '../services/registroDiarioService.js';

export const registroDiarioController = {
  listar(req, res) {
    res.json(registroDiarioService.listar(req.query.usuarioId));
  },

  buscarPorId(req, res) {
    res.json(registroDiarioService.buscarPorId(Number(req.params.id)));
  },

  criar(req, res) {
    const novo = registroDiarioService.criar(req.body);
    res.status(201).json(novo);
  },

  atualizar(req, res) {
    res.json(registroDiarioService.atualizar(Number(req.params.id), req.body));
  },

  remover(req, res) {
    registroDiarioService.remover(Number(req.params.id));
    res.status(204).end();
  },
};
