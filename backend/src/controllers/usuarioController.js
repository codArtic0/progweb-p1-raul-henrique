import { usuarioService } from '../services/usuarioService.js';

export const usuarioController = {
  listar(req, res) {
    res.json(usuarioService.listar());
  },

  buscarPorId(req, res) {
    res.json(usuarioService.buscarPorId(Number(req.params.id)));
  },

  criar(req, res) {
    const novo = usuarioService.criar(req.body);
    res.status(201).json(novo);
  },

  atualizar(req, res) {
    res.json(usuarioService.atualizar(Number(req.params.id), req.body));
  },

  remover(req, res) {
    usuarioService.remover(Number(req.params.id));
    res.status(204).end();
  },
};
