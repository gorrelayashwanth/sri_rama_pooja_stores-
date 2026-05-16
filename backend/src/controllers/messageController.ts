import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

const getSingleParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { parentId: null }, // Only get top-level messages
        include: { replies: { orderBy: { createdAt: 'asc' } } },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.message.count({ where: { parentId: null } })
    ]);

    res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};


export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getSingleParam(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'Message id is required' });
    }
    await prisma.message.update({
      where: { id },
      data: { isRead: true }
    });
    res.status(200).json({ success: true, message: 'Message marked as read' });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getSingleParam(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'Message id is required' });
    }
    await prisma.message.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
};

export const createMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, subject, message, parentId, isAdmin } = req.body;
    const newMessage = await prisma.message.create({
      data: { 
        name, 
        email, 
        phone, 
        subject, 
        message,
        parentId: parentId || null,
        isAdmin: isAdmin || false
      }
    });
    res.status(201).json({ success: true, message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    next(error);
  }
};

