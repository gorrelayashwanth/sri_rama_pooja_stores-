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

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        gte: minPrice !== undefined && minPrice !== '' ? Number(minPrice) : undefined,
        lte: maxPrice !== undefined && maxPrice !== '' ? Number(maxPrice) : undefined
      };
    }

    if (req.query.inStock === 'true') {
      where.stock = { gt: 0 };
    }

    if (req.query.isSouthIndian === 'true') {
      where.tags = { has: 'South Indian' };
    }

    if (req.query.festival) {
      where.festival = { has: String(req.query.festival) };
    }

    if (req.query.deity) {
      where.deity = { has: String(req.query.deity) };
    }

    if (req.query.isFeatured === 'true') {
      where.isFeatured = true;
    }

    if (req.query.type === 'bestselling') {
      where.isFeatured = true;
    }

    let orderBy: { createdAt?: 'desc' | 'asc'; price?: 'desc' | 'asc' } = { createdAt: 'desc' };
    const sort = String(req.query.sort || '');
    if (sort === 'price-low') orderBy = { price: 'asc' };
    else if (sort === 'price-high') orderBy = { price: 'desc' };
    else if (req.query.type === 'newest' || sort === 'newest') orderBy = { createdAt: 'desc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: true,
          category: true
        },
        skip,
        take: Number(limit),
        orderBy
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
    const { 
      name, slug, description, price, salePrice, discount, sku, stock, categoryId, images,
      subcategory, unit, minOrderQty, material, weight, dimensions, tags, festival, deity, imagePrompt, isFeatured, priceTiers
    } = req.body;
    
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : null,
        discount: discount ? Number(discount) : 0,
        sku,
        stock: Number(stock),
        categoryId,
        subcategory,
        unit,
        minOrderQty: Number(minOrderQty || 1),
        material,
        weight,
        dimensions,
        tags: Array.isArray(tags) ? tags : [],
        festival: Array.isArray(festival) ? festival : [],
        deity: Array.isArray(deity) ? deity : [],
        imagePrompt,
        isFeatured: isFeatured === true || isFeatured === 'true',
        priceTiers: priceTiers ? (typeof priceTiers === "string" ? JSON.parse(priceTiers) : priceTiers) : null,
        images: {
          create: images && Array.isArray(images) ? images.map((img: any) => ({
            url: img.url,
            publicId: img.publicId
          })) : []
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
    const { 
      name, slug, description, price, salePrice, discount, sku, stock, categoryId, images,
      subcategory, unit, minOrderQty, material, weight, dimensions, tags, festival, deity, imagePrompt, isFeatured, isAvailable, priceTiers
    } = req.body;
    
    // Simple update - for images, we might want a separate logic
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        price: price !== undefined ? Number(price) : undefined,
        salePrice: salePrice !== undefined ? (salePrice ? Number(salePrice) : null) : undefined,
        discount: discount !== undefined ? Number(discount) : undefined,
        sku,
        stock: stock !== undefined ? Number(stock) : undefined,
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : undefined,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
        categoryId,
        subcategory,
        unit,
        minOrderQty: minOrderQty !== undefined ? Number(minOrderQty) : undefined,
        material,
        weight,
        dimensions,
        tags: Array.isArray(tags) ? tags : undefined,
        festival: Array.isArray(festival) ? festival : undefined,
        deity: Array.isArray(deity) ? deity : undefined,
        imagePrompt,
        priceTiers: priceTiers !== undefined ? (typeof priceTiers === "string" ? JSON.parse(priceTiers) : priceTiers) : undefined
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

export const importProductsBulk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { products } = req.body;
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ success: false, message: 'Invalid payload: products array is required' });
    }

    let count = 0;
    for (const p of products) {
      if (!p.name || !p.categoryId || !p.price) continue;
      
      const slug = p.slug || p.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const sku = p.sku || `SRP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      await prisma.product.upsert({
        where: { sku: sku },
        update: {
          name: p.name,
          slug: slug,
          description: p.description || '',
          price: Number(p.price),
          stock: p.stock ? Number(p.stock) : 100,
          categoryId: p.categoryId,
        },
        create: {
          sku: sku,
          name: p.name,
          slug: slug,
          description: p.description || '',
          price: Number(p.price),
          stock: p.stock ? Number(p.stock) : 100,
          categoryId: p.categoryId,
        }
      });
      count++;
    }

    res.status(200).json({ success: true, message: `Successfully imported ${count} products` });
  } catch (error) {
    next(error);
  }
};

export const generateImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getSingleParam(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'Product id is required' });
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (!product.imagePrompt) {
      return res.status(400).json({ success: false, message: 'Product does not have an imagePrompt configured' });
    }

    // Mock API Call to Anthropic/DALL-E
    // In production, you would call your API here and get an image URL.
    // Since we don't have an API key, we will generate a high-quality Unsplash source placeholder 
    // or a stable placeholder URL. Let's use a nice Unsplash source.
    const mockGeneratedUrl = `https://images.unsplash.com/photo-1604147495798-57beb5d6af73?q=80&w=800&auto=format&fit=crop`; // Generic nice image

    // Add it to the product's images
    await prisma.productImage.create({
      data: {
        url: mockGeneratedUrl,
        publicId: `gen-${product.sku}-${Date.now()}`,
        productId: product.id
      }
    });

    res.status(200).json({ success: true, message: 'Image generated successfully', data: { url: mockGeneratedUrl } });
  } catch (error) {
    next(error);
  }
};
