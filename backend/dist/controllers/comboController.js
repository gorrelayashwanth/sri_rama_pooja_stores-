"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCombo = exports.updateCombo = exports.createCombo = exports.getCombos = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getSingleParam = (value) => Array.isArray(value) ? value[0] : value;
const getCombos = async (req, res, next) => {
    try {
        const combos = await prisma_1.default.combo.findMany({
            include: {
                products: {
                    select: { id: true, name: true, price: true }
                }
            }
        });
        res.status(200).json({ success: true, data: combos });
    }
    catch (error) {
        next(error);
    }
};
exports.getCombos = getCombos;
const createCombo = async (req, res, next) => {
    try {
        const { name, description, price, salePrice, productIds, isActive } = req.body;
        const combo = await prisma_1.default.combo.create({
            data: {
                name,
                description,
                price: Number(price),
                salePrice: salePrice ? Number(salePrice) : null,
                isActive,
                products: {
                    connect: productIds.map((id) => ({ id }))
                }
            },
            include: {
                products: true
            }
        });
        res.status(201).json({ success: true, message: 'Combo created successfully', data: combo });
    }
    catch (error) {
        next(error);
    }
};
exports.createCombo = createCombo;
const updateCombo = async (req, res, next) => {
    try {
        const id = getSingleParam(req.params.id);
        if (!id) {
            return res.status(400).json({ success: false, message: 'Combo id is required' });
        }
        const { name, description, price, salePrice, productIds, isActive } = req.body;
        const combo = await prisma_1.default.combo.update({
            where: { id },
            data: {
                name,
                description,
                price: price ? Number(price) : undefined,
                salePrice: salePrice ? Number(salePrice) : undefined,
                isActive,
                products: productIds ? {
                    set: productIds.map((id) => ({ id }))
                } : undefined
            }
        });
        res.status(200).json({ success: true, message: 'Combo updated successfully', data: combo });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCombo = updateCombo;
const deleteCombo = async (req, res, next) => {
    try {
        const id = getSingleParam(req.params.id);
        if (!id) {
            return res.status(400).json({ success: false, message: 'Combo id is required' });
        }
        await prisma_1.default.combo.delete({ where: { id } });
        res.status(200).json({ success: true, message: 'Combo deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCombo = deleteCombo;
