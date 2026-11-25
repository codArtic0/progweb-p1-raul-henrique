import { habitoService } from '../services/habitoService.js';

export const habitoController = {
  listar(req, res) {
    res.json(habitoService.listar());
  },

  buscarPorId(req, res) {
    res.json(habitoService.buscarPorId(Number(req.params.id)));
  },

  criar(req, res) {
    const novo = habitoService.criar(req.body);
    res.status(201).json(novo);
  },

  atualizar(req, res) {
    res.json(habitoService.atualizar(Number(req.params.id), req.body));
  },

  remover(req, res) {
    habitoService.remover(Number(req.params.id));
    res.status(204).end();
  },
};
