"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeChiefAdmin = exports.authorizeAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
};
exports.authenticate = authenticate;
const authorizeAdmin = (req, res, next) => {
    if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'CHIEF_ADMIN')) {
        return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
    }
    next();
};
exports.authorizeAdmin = authorizeAdmin;
const authorizeChiefAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'CHIEF_ADMIN') {
        return res.status(403).json({ success: false, message: 'Forbidden: Chief Admin access required' });
    }
    next();
};
exports.authorizeChiefAdmin = authorizeChiefAdmin;
