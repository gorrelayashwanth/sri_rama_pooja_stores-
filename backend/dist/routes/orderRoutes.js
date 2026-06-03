"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Customer routes (must be before /:id admin routes)
router.post('/', authMiddleware_1.authenticate, orderController_1.createOrder);
router.get('/my-orders', authMiddleware_1.authenticate, orderController_1.getMyOrders);
router.get('/:id', authMiddleware_1.authenticate, orderController_1.getOrderDetail);
// Admin routes
router.use(authMiddleware_1.authenticate, authMiddleware_1.authorizeAdmin);
router.get('/', orderController_1.getOrders);
router.get('/recent', orderController_1.getRecentPlacedOrders);
router.patch('/:id/status', orderController_1.updateOrderStatus);
exports.default = router;
