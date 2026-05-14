"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleAvailability = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductBySlug = exports.getProducts = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getSingleParam = (value) => Array.isArray(value) ? value[0] : value;
const getProducts = async (req, res, next) => {
    try {
        const { category, search, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {
            isAvailable: true,
        };
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
            prisma_1.default.product.findMany({
                where,
                include: {
                    images: true,
                    category: true
                },
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' }
            }),
            prisma_1.default.product.count({ where })
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
    }
    catch (error) {
        next(error);
    }
};
exports.getProducts = getProducts;
const getProductBySlug = async (req, res, next) => {
    try {
        const slug = getSingleParam(req.params.slug);
        if (!slug) {
            return res.status(400).json({ success: false, message: 'Product slug is required' });
        }
        const product = await prisma_1.default.product.findUnique({
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
    }
    catch (error) {
        next(error);
    }
};
exports.getProductBySlug = getProductBySlug;
const createProduct = async (req, res, next) => {
    try {
        const { name, slug, description, price, salePrice, discount, sku, stock, categoryId, images } = req.body;
        const product = await prisma_1.default.product.create({
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
                    create: images.map((img) => ({
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
    }
    catch (error) {
        next(error);
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res, next) => {
    try {
        const id = getSingleParam(req.params.id);
        if (!id) {
            return res.status(400).json({ success: false, message: 'Product id is required' });
        }
        const { name, slug, description, price, salePrice, discount, sku, stock, categoryId, images } = req.body;
        // Simple update - for images, we might want a separate logic
        const product = await prisma_1.default.product.update({
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
    }
    catch (error) {
        next(error);
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res, next) => {
    try {
        const id = getSingleParam(req.params.id);
        if (!id) {
            return res.status(400).json({ success: false, message: 'Product id is required' });
        }
        await prisma_1.default.product.delete({ where: { id } });
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProduct = deleteProduct;
const toggleAvailability = async (req, res, next) => {
    try {
        const id = getSingleParam(req.params.id);
        if (!id) {
            return res.status(400).json({ success: false, message: 'Product id is required' });
        }
        const product = await prisma_1.default.product.findUnique({ where: { id } });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        const updatedProduct = await prisma_1.default.product.update({
            where: { id },
            data: { isAvailable: !product.isAvailable }
        });
        res.status(200).json({ success: true, message: 'Availability toggled', data: updatedProduct });
    }
    catch (error) {
        next(error);
    }
};
exports.toggleAvailability = toggleAvailability;
