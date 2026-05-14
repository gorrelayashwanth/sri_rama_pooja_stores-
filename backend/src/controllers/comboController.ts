import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

const getSingleParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export const getCombos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const combos = await prisma.combo.findMany({
      include: {
        products: {
          select: { id: true, name: true, price: true }
        }
      }
    });
    res.status(200).json({ success: true, data: combos });
  } catch (error) {
    next(error);
  }
};

export const createCombo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, price, salePrice, productIds, isActive } = req.body;
    
    const combo = await prisma.combo.create({
      data: {
        name,
        description,
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : null,
        isActive,
        products: {
          connect: productIds.map((id: string) => ({ id }))
        }
      },
      include: {
        products: true
      }
    });
    
    res.status(201).json({ success: true, message: 'Combo created successfully', data: combo });
  } catch (error) {
    next(error);
  }
};

export const updateCombo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getSingleParam(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'Combo id is required' });
    }
    const { name, description, price, salePrice, productIds, isActive } = req.body;
    
    const combo = await prisma.combo.update({
      where: { id },
      data: {
        name,
        description,
        price: price ? Number(price) : undefined,
        salePrice: salePrice ? Number(salePrice) : undefined,
        isActive,
        products: productIds ? {
          set: productIds.map((id: string) => ({ id }))
        } : undefined
      }
    });
    
    res.status(200).json({ success: true, message: 'Combo updated successfully', data: combo });
  } catch (error) {
    next(error);
  }
};

export const deleteCombo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getSingleParam(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'Combo id is required' });
    }
    await prisma.combo.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Combo deleted successfully' });
  } catch (error) {
    next(error);
  }
};
