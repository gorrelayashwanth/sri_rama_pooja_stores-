"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentPlacedOrders = exports.getOrderDetail = exports.updateOrderStatus = exports.getOrders = exports.getMyOrders = exports.createOrder = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getSingleParam = (value) => Array.isArray(value) ? value[0] : value;
const generateOrderNumber = () => `SRP-${Date.now().toString(36).toUpperCase().slice(-8)}`;
/** Parse checkout address string: "line1, city - pincode" */
function parseCheckoutAddress(addressStr) {
    const parts = addressStr.split(',').map((s) => s.trim());
    const line1 = parts[0] || addressStr;
    let city = 'Vijayawada';
    let pincode = '520001';
    if (parts.length >= 2) {
        const last = parts[parts.length - 1];
        const match = last.match(/^(.+?)\s*-\s*(\d{6})$/);
        if (match) {
            city = match[1].trim();
            pincode = match[2];
        }
        else {
            city = last;
        }
    }
    return { line1, city, pincode };
}
const createOrder = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Please log in to place an order' });
        }
        const { items, address, phone, paymentMethod = 'COD', couponCode } = req.body;
        if (!items?.length) {
            return res.status(400).json({ success: false, message: 'Your cart is empty' });
        }
        if (!address?.trim()) {
            return res.status(400).json({ success: false, message: 'Delivery address is required' });
        }
        if (!phone?.trim()) {
            return res.status(400).json({ success: false, message: 'Phone number is required' });
        }
        const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const { line1, city, pincode } = parseCheckoutAddress(String(address));
        const deliveryAddress = await prisma_1.default.address.create({
            data: {
                userId,
                fullName: user.name,
                phone: String(phone),
                line1,
                city,
                state: 'Andhra Pradesh',
                pincode,
            },
        });
        let subtotal = 0;
        const orderItemsData = [];
        for (const item of items) {
            const product = await prisma_1.default.product.findUnique({ where: { id: item.productId } });
            if (!product) {
                return res.status(400).json({ success: false, message: `Product not found` });
            }
            if (!product.isAvailable) {
                return res.status(400).json({ success: false, message: `${product.name} is currently unavailable` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${product.stock} units of ${product.name} available`,
                });
            }
            const unitPrice = item.price != null && item.price > 0
                ? Number(item.price)
                : product.salePrice && product.salePrice > 0
                    ? product.salePrice
                    : product.price;
            const lineTotal = unitPrice * item.quantity;
            subtotal += lineTotal;
            orderItemsData.push({
                productId: product.id,
                quantity: item.quantity,
                price: unitPrice,
                total: lineTotal,
            });
        }
        const shippingFee = subtotal > 1000 ? 0 : 99;
        let discountAmount = 0;
        if (couponCode) {
            const coupon = await prisma_1.default.coupon.findUnique({
                where: { code: String(couponCode).toUpperCase() },
            });
            if (coupon && coupon.isActive && new Date() >= coupon.startDate && new Date() <= coupon.endDate) {
                if (subtotal >= coupon.minOrderValue) {
                    if (coupon.type === 'PERCENTAGE') {
                        discountAmount = (subtotal * coupon.value) / 100;
                        if (coupon.maxDiscount)
                            discountAmount = Math.min(discountAmount, coupon.maxDiscount);
                    }
                    else {
                        discountAmount = coupon.value;
                    }
                    await prisma_1.default.coupon.update({
                        where: { id: coupon.id },
                        data: { usedCount: { increment: 1 } },
                    });
                }
            }
        }
        const payableAmount = Math.max(0, subtotal + shippingFee - discountAmount);
        const order = await prisma_1.default.$transaction(async (tx) => {
            const created = await tx.order.create({
                data: {
                    orderNumber: generateOrderNumber(),
                    userId,
                    addressId: deliveryAddress.id,
                    totalAmount: subtotal,
                    discountAmount,
                    shippingFee,
                    payableAmount,
                    paymentMethod: paymentMethod === 'COD' ? 'COD' : 'COD',
                    paymentStatus: 'PENDING',
                    status: 'PLACED',
                    items: { create: orderItemsData },
                },
                include: {
                    items: { include: { product: { select: { name: true } } } },
                    address: true,
                },
            });
            for (const item of orderItemsData) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }
            return created;
        });
        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: order,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createOrder = createOrder;
const getMyOrders = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const orders = await prisma_1.default.order.findMany({
            where: { userId },
            include: {
                items: { include: { product: { select: { name: true, slug: true, images: true } } } },
                address: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ success: true, data: orders });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyOrders = getMyOrders;
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
const getRecentPlacedOrders = async (req, res, next) => {
    try {
        const { since } = req.query;
        const where = { status: 'PLACED' };
        if (since) {
            const parsedSince = new Date(String(since));
            if (!isNaN(parsedSince.getTime())) {
                where.createdAt = { gt: parsedSince };
            }
        }
        const orders = await prisma_1.default.order.findMany({
            where,
            select: { id: true, orderNumber: true, createdAt: true, totalAmount: true },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ success: true, data: orders });
    }
    catch (error) {
        next(error);
    }
};
exports.getRecentPlacedOrders = getRecentPlacedOrders;
