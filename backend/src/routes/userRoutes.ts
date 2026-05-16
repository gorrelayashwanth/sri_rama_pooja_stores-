import { Router } from 'express';
import { getUsers, toggleBlockUser } from '../controllers/userController';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, authorizeAdmin, getUsers);
router.patch('/:id/toggle-block', authenticate, authorizeAdmin, toggleBlockUser);

export default router;
