"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderDetail = exports.updateOrderStatus = exports.getOrders = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getSingleParam = (value) => Array.isArray(value) ? value[0] : value;
const getOrders = async (req, res, next) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
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
            prisma_1.default.order.findMany({
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
            prisma_1.default.order.count({ where })
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
    }
    catch (error) {
        next(error);
    }
};
exports.getOrders = getOrders;
const updateOrderStatus = async (req, res, next) => {
    try {
        const id = getSingleParam(req.params.id);
        if (!id) {
            return res.status(400).json({ success: false, message: 'Order id is required' });
        }
        const { status, awbNumber } = req.body;
        const order = await prisma_1.default.order.update({
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
    }
    catch (error) {
        next(error);
    }
};
exports.updateOrderStatus = updateOrderStatus;
const getOrderDetail = async (req, res, next) => {
    try {
        const id = getSingleParam(req.params.id);
        if (!id) {
            return res.status(400).json({ success: false, message: 'Order id is required' });
        }
        const order = await prisma_1.default.order.findUnique({
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
    }
    catch (error) {
        next(error);
    }
};
exports.getOrderDetail = getOrderDetail;
