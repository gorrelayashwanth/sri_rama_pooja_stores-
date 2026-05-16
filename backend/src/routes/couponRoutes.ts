import { Router } from 'express';
import { getCoupons, createCoupon, validateCoupon } from '../controllers/couponController';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, authorizeAdmin, getCoupons);
router.post('/', authenticate, authorizeAdmin, createCoupon);
router.post('/validate', validateCoupon); // Publicly accessible for checkout

export default router;
