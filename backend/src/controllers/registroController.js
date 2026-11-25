import { registroService } from '../services/registroService.js';

export const registroController = {
  listar(req, res) {
    res.json(registroService.listar(req.query.habitoId));
  },

  buscarPorId(req, res) {
    res.json(registroService.buscarPorId(Number(req.params.id)));
  },

  criar(req, res) {
    const novo = registroService.criar(req.body);
    res.status(201).json(novo);
  },

  atualizar(req, res) {
    res.json(registroService.atualizar(Number(req.params.id), req.body));
  },

  remover(req, res) {
    registroService.remover(Number(req.params.id));
    res.status(204).end();
  },
};
