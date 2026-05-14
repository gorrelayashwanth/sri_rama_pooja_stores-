import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

const getSingleParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = getSingleParam(req.params.slug);
    if (!slug) {
      return res.status(400).json({ success: false, message: 'Category slug is required' });
    }
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          include: {
            images: true
          }
        }
      }
    });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, slug, description, image, parentId } = req.body;
    const category = await prisma.category.create({
      data: { name, slug, description, image, parentId }
    });
    res.status(201).json({ success: true, message: 'Category created successfully', data: category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getSingleParam(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'Category id is required' });
    }
    const { name, slug, description, image, parentId } = req.body;
    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, description, image, parentId }
    });
    res.status(200).json({ success: true, message: 'Category updated successfully', data: category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getSingleParam(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'Category id is required' });
    }
    await prisma.category.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
