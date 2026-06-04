"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let code = err.code || 'INTERNAL_SERVER_ERROR';
    console.error(`[Error] ${req.method} ${req.path} >> ${message}`);
    if (err.code)
        console.error(`[Error Code] ${err.code}`);
    if (err.stack)
        console.error(err.stack);
    // Handle Prisma unique constraint failed error
    if (err.code === 'P2002') {
        statusCode = 400;
        code = 'UNIQUE_CONSTRAINT_FAILED';
        const target = err.meta?.target;
        const fields = Array.isArray(target) ? target.join(', ') : typeof target === 'string' ? target : '';
        message = `A unique record constraint failed. The field(s) ${fields ? `'${fields}'` : ''} already exist in our database.`;
    }
    // Specific handling for Prisma connection errors
    if (message.includes("Can't reach database server") || message.includes("PrismaClientKnownRequestError")) {
        console.error("CRITICAL: Database connection error detected.");
    }
    // Sanitize 500 internal server errors in production to avoid leaking database schema details
    if (statusCode === 500 && process.env.NODE_ENV === 'production') {
        message = 'An unexpected error occurred on our server. Please try again later.';
    }
    res.status(statusCode).json({
        success: false,
        message,
        code,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};
exports.errorHandler = errorHandler;
