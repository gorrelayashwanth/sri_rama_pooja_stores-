"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_1.authenticate, authMiddleware_1.authorizeAdmin, userController_1.getUsers);
router.patch('/:id/toggle-block', authMiddleware_1.authenticate, authMiddleware_1.authorizeAdmin, userController_1.toggleBlockUser);
exports.default = router;
