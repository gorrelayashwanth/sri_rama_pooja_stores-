import { Router } from 'express';
import { getCombos, createCombo, updateCombo, deleteCombo } from '../controllers/comboController';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getCombos);

// Protected Admin Routes
router.post('/', authenticate, authorizeAdmin, createCombo);
router.put('/:id', authenticate, authorizeAdmin, updateCombo);
router.delete('/:id', authenticate, authorizeAdmin, deleteCombo);

export default router;