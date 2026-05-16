import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  console.error(`[Error] ${req.method} ${req.path} >> ${message}`);
  if (err.code) console.error(`[Error Code] ${err.code}`);
  if (err.stack) console.error(err.stack);

  // Specific handling for Prisma connection errors
  if (message.includes("Can't reach database server") || message.includes("PrismaClientKnownRequestError")) {
    console.error("CRITICAL: Database connection error detected.");
  }


  res.status(statusCode).json({
    success: false,
    message,
    code: err.code || 'INTERNAL_SERVER_ERROR',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};