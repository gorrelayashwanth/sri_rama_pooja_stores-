"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryBySlug = exports.getCategories = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getSingleParam = (value) => Array.isArray(value) ? value[0] : value;
const getCategories = async (req, res, next) => {
    try {
        const categories = await prisma_1.default.category.findMany({
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });
        res.status(200).json({ success: true, data: categories });
    }
    catch (error) {
        next(error);
    }
};
exports.getCategories = getCategories;
const getCategoryBySlug = async (req, res, next) => {
    try {
        const slug = getSingleParam(req.params.slug);
        if (!slug) {
            return res.status(400).json({ success: false, message: 'Category slug is required' });
        }
        const category = await prisma_1.default.category.findUnique({
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
    }
    catch (error) {
        next(error);
    }
};
exports.getCategoryBySlug = getCategoryBySlug;
const createCategory = async (req, res, next) => {
    try {
        const { name, slug, description, image, parentId } = req.body;
        const category = await prisma_1.default.category.create({
            data: { name, slug, description, image, parentId }
        });
        res.status(201).json({ success: true, message: 'Category created successfully', data: category });
    }
    catch (error) {
        next(error);
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res, next) => {
    try {
        const id = getSingleParam(req.params.id);
        if (!id) {
            return res.status(400).json({ success: false, message: 'Category id is required' });
        }
        const { name, slug, description, image, parentId } = req.body;
        const category = await prisma_1.default.category.update({
            where: { id },
            data: { name, slug, description, image, parentId }
        });
        res.status(200).json({ success: true, message: 'Category updated successfully', data: category });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res, next) => {
    try {
        const id = getSingleParam(req.params.id);
        if (!id) {
            return res.status(400).json({ success: false, message: 'Category id is required' });
        }
        await prisma_1.default.category.delete({ where: { id } });
        res.status(200).json({ success: true, message: 'Category deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCategory = deleteCategory;
