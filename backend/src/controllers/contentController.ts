import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

export const getContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let content = await prisma.content.findUnique({
      where: { id: 'singleton' }
    });

    if (!content) {
      content = await prisma.content.create({
        data: { id: 'singleton' }
      });
    }

    res.status(200).json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};

export const updateContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const content = await prisma.content.upsert({
      where: { id: 'singleton' },
      update: data,
      create: { ...data, id: 'singleton' }
    });
    res.status(200).json({ success: true, message: 'Content updated successfully', data: content });
  } catch (error) {
    next(error);
  }
};
