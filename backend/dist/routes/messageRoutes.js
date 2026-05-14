"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messageController_1 = require("../controllers/messageController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public route for customers to send messages
router.post('/', messageController_1.createMessage);
// Admin protected routes
router.get('/', authMiddleware_1.authenticate, authMiddleware_1.authorizeAdmin, messageController_1.getMessages);
router.patch('/:id/read', authMiddleware_1.authenticate, authMiddleware_1.authorizeAdmin, messageController_1.markAsRead);
router.delete('/:id', authMiddleware_1.authenticate, authMiddleware_1.authorizeAdmin, messageController_1.deleteMessage);
exports.default = router;
