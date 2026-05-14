import { Router } from 'express';
import { getOrders, updateOrderStatus, getOrderDetail } from '../controllers/orderController';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();

// All order routes are admin protected
router.use(authenticate, authorizeAdmin);

router.get('/', getOrders);
router.get('/:id', getOrderDetail);
router.patch('/:id/status', updateOrderStatus);

export default router;