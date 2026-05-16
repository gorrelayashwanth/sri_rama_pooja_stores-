import { Router } from 'express';
import { getReviews, createReview, deleteReview } from '../controllers/reviewController';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, authorizeAdmin, getReviews);
router.post('/', authenticate, createReview);
router.delete('/:id', authenticate, authorizeAdmin, deleteReview);

export default router;
