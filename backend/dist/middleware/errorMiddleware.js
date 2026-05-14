"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    console.error(`[Error] ${req.method} ${req.path} >> ${message}`);
    if (err.stack)
        console.error(err.stack);
    res.status(statusCode).json({
        success: false,
        message,
        code: err.code || 'INTERNAL_SERVER_ERROR',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};
exports.errorHandler = errorHandler;
