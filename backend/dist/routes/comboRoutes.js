"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comboController_1 = require("../controllers/comboController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/', comboController_1.getCombos);
// Protected Admin Routes
router.post('/', authMiddleware_1.authenticate, authMiddleware_1.authorizeAdmin, comboController_1.createCombo);
router.put('/:id', authMiddleware_1.authenticate, authMiddleware_1.authorizeAdmin, comboController_1.updateCombo);
router.delete('/:id', authMiddleware_1.authenticate, authMiddleware_1.authorizeAdmin, comboController_1.deleteCombo);
exports.default = router;
