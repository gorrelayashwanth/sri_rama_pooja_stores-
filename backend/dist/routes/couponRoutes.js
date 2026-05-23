"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const couponController_1 = require("../controllers/couponController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_1.authenticate, authMiddleware_1.authorizeAdmin, couponController_1.getCoupons);
router.post('/', authMiddleware_1.authenticate, authMiddleware_1.authorizeAdmin, couponController_1.createCoupon);
router.post('/validate', couponController_1.validateCoupon); // Publicly accessible for checkout
exports.default = router;
