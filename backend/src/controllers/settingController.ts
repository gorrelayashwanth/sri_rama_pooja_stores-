import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let settings = await prisma.setting.findUnique({
      where: { id: 'singleton' }
    });

    if (!settings) {
      settings = await prisma.setting.create({
        data: { id: 'singleton' }
      });
    }

    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const settings = await prisma.setting.upsert({
      where: { id: 'singleton' },
      update: data,
      create: { ...data, id: 'singleton' }
    });
    res.status(200).json({ success: true, message: 'Settings updated successfully', data: settings });
  } catch (error) {
    next(error);
  }
};
