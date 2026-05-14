import { Router } from 'express';
import { getMessages, markAsRead, deleteMessage, createMessage } from '../controllers/messageController';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();

// Public route for customers to send messages
router.post('/', createMessage);

// Admin protected routes
router.get('/', authenticate, authorizeAdmin, getMessages);
router.patch('/:id/read', authenticate, authorizeAdmin, markAsRead);
router.delete('/:id', authenticate, authorizeAdmin, deleteMessage);

export default router;