"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/', productController_1.getProducts);
router.get('/:slug', productController_1.getProductBySlug);
// Protected Admin Routes
router.post('/', authMiddleware_1.authenticate, authMiddleware_1.authorizeAdmin, productController_1.createProduct);
router.put('/:id', authMiddleware_1.authenticate, authMiddleware_1.authorizeAdmin, productController_1.updateProduct);
router.delete('/:id', authMiddleware_1.authenticate, authMiddleware_1.authorizeAdmin, productController_1.deleteProduct);
router.patch('/:id/availability', authMiddleware_1.authenticate, authMiddleware_1.authorizeAdmin, productController_1.toggleAvailability);
exports.default = router;
