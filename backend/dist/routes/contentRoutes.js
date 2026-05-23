"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contentController_1 = require("../controllers/contentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/', contentController_1.getContent);
router.patch('/', authMiddleware_1.authenticate, authMiddleware_1.authorizeAdmin, contentController_1.updateContent);
exports.default = router;
