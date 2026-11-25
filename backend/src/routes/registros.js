import { Router } from 'express';
import { registroController } from '../controllers/registroController.js';

const router = Router();

router.get('/', registroController.listar);
router.get('/:id', registroController.buscarPorId);
router.post('/', registroController.criar);
router.put('/:id', registroController.atualizar);
router.delete('/:id', registroController.remover);

export default router;
