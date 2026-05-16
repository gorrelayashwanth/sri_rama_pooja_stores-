import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingController';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getSettings);
router.patch('/', authenticate, authorizeAdmin, updateSettings);

export default router;
