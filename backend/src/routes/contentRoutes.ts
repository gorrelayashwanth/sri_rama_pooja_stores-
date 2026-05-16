import { Router } from 'express';
import { getContent, updateContent } from '../controllers/contentController';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getContent);
router.patch('/', authenticate, authorizeAdmin, updateContent);

export default router;
