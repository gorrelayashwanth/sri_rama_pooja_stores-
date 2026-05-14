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
  if (err.stack) console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    message,
    code: err.code || 'INTERNAL_SERVER_ERROR',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};