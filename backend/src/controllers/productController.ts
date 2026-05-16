import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

const getSingleParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, search, minPrice, maxPrice, page = 1, limit = 10, all } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const where: any = {};

    if (all !== 'true') {
      where.isAvailable = true;
    }


    if (category) {
      where.category = { slug: String(category) };
    }

    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } }
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {
        gte: minPrice ? Number(minPrice) : undefined,
        lte: maxPrice ? Number(maxPrice) : undefined
      };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: true,
          category: true
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: products,
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

export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = getSingleParam(req.params.slug);
    if (!slug) {
      return res.status(400).json({ success: false, message: 'Product slug is required' });
    }
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: true,
        category: true,
        reviews: {
          include: {
            user: {
              select: { name: true }
            }
          }
        }
      }
    });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, slug, description, price, salePrice, discount, sku, stock, categoryId, images } = req.body;
    
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : null,
        discount: discount ? Number(discount) : null,
        sku,
        stock: Number(stock),
        categoryId,
        images: {
          create: images.map((img: any) => ({
            url: img.url,
            publicId: img.publicId
          }))
        }
      },
      include: {
        images: true
      }
    });
    
    res.status(201).json({ success: true, message: 'Product created successfully', data: product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getSingleParam(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'Product id is required' });
    }
    const { name, slug, description, price, salePrice, discount, sku, stock, categoryId, images } = req.body;
    
    // Simple update - for images, we might want a separate logic
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        price: price ? Number(price) : undefined,
        salePrice: salePrice ? Number(salePrice) : undefined,
        discount: discount ? Number(discount) : undefined,
        sku,
        stock: stock ? Number(stock) : undefined,
        categoryId
      }
    });
    
    res.status(200).json({ success: true, message: 'Product updated successfully', data: product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getSingleParam(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'Product id is required' });
    }
    await prisma.product.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const toggleAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getSingleParam(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'Product id is required' });
    }
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { isAvailable: !product.isAvailable }
    });
    res.status(200).json({ success: true, message: 'Availability toggled', data: updatedProduct });
  } catch (error) {
    next(error);
  }
};
