import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

const getSingleParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status && status !== 'All Orders') {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { orderNumber: { contains: String(search), mode: 'insensitive' } },
        { awbNumber: { contains: String(search), mode: 'insensitive' } },
        { user: { name: { contains: String(search), mode: 'insensitive' } } }
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { name: true, phone: true, email: true } },
          address: true,
          items: {
            include: {
              product: { select: { name: true } }
            }
          }
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: orders,
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

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getSingleParam(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'Order id is required' });
    }
    const { status, awbNumber } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { 
        status,
        awbNumber: awbNumber || undefined
      },
      include: {
        user: { select: { name: true } }
      }
    });

    res.status(200).json({ success: true, message: 'Order status updated', data: order });
  } catch (error) {
    next(error);
  }
};

export const getOrderDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getSingleParam(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'Order id is required' });
    }
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, phone: true, email: true } },
        address: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const getRecentPlacedOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { since } = req.query;
    const where: any = { status: 'PLACED' };
    if (since) {
      const parsedSince = new Date(String(since));
      if (!isNaN(parsedSince.getTime())) {
        where.createdAt = { gt: parsedSince };
      }
    }
    const orders = await prisma.order.findMany({
      where,
      select: { id: true, orderNumber: true, createdAt: true, totalAmount: true },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};
