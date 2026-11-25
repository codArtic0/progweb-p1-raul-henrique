import { Router } from 'express';
import { habitoController } from '../controllers/habitoController.js';

const router = Router();

router.get('/', habitoController.listar);
router.get('/:id', habitoController.buscarPorId);
router.post('/', habitoController.criar);
router.put('/:id', habitoController.atualizar);
router.delete('/:id', habitoController.remover);

export default router;
