import { Router } from 'express';
import { registroDiarioController } from '../controllers/registroDiarioController.js';

const router = Router();

router.get('/', registroDiarioController.listar);
router.get('/:id', registroDiarioController.buscarPorId);
router.post('/', registroDiarioController.criar);
router.put('/:id', registroDiarioController.atualizar);
router.delete('/:id', registroDiarioController.remover);

export default router;
