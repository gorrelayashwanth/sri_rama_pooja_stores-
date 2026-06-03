import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  getOrderDetail,
  getRecentPlacedOrders,
} from '../controllers/orderController';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();

// Customer routes (must be before /:id admin routes)
router.post('/', authenticate, createOrder);
router.get('/my-orders', authenticate, getMyOrders);
router.get('/:id', authenticate, getOrderDetail);

// Admin routes
router.use(authenticate, authorizeAdmin);
router.get('/', getOrders);
router.get('/recent', getRecentPlacedOrders);
router.patch('/:id/status', updateOrderStatus);

export default router;
