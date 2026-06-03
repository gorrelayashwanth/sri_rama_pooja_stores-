"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentPlacedOrders = exports.getOrderDetail = exports.updateOrderStatus = exports.getOrders = exports.getMyOrders = exports.createOrder = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const socketService_1 = require("../services/socketService");
const notificationService_1 = require("../services/notificationService");
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
/** Calculate straight-line distance in km via Haversine Formula */
function getHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}
const createOrder = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Please log in to place an order' });
        }
        const { items, address, phone, paymentMethod = 'COD', couponCode, latitude, longitude } = req.body;
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
        // Get delivery settings configuration
        const settings = await prisma_1.default.setting.findUnique({ where: { id: 'singleton' } });
        const storeLat = settings?.storeLatitude ?? 16.5186;
        const storeLng = settings?.storeLongitude ?? 80.6200;
        const ratePerKm = settings?.deliveryRatePerKm ?? 10;
        const maxRadius = settings?.deliveryRadiusKm ?? 15;
        let shippingFee = 99; // Fallback shipping fee
        let distance = 0;
        // Check delivery zone and calculate dynamic delivery fee if coordinates provided
        if (latitude != null && longitude != null) {
            distance = getHaversineDistance(Number(latitude), Number(longitude), storeLat, storeLng);
            // Enforce boundary check at API level
            if (distance > maxRadius) {
                return res.status(400).json({
                    success: false,
                    message: `Delivery is currently available only in and around Vijayawada (max ${maxRadius}km radius). Your location is ${distance.toFixed(1)}km away.`
                });
            }
            shippingFee = Math.round(distance * ratePerKm);
        }
        else {
            // Pincode fallback check: check if it starts with 520 or 521 (Vijayawada and Krishna district area)
            const pinStr = String(pincode).trim();
            const isVijayawadaPin = pinStr.startsWith('520') || pinStr.startsWith('521');
            if (!isVijayawadaPin) {
                return res.status(400).json({
                    success: false,
                    message: 'Delivery is currently available only in and around Vijayawada (Krishna District pincode required).'
                });
            }
        }
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
                selectedTier: item.selectedTier || null,
            });
        }
        // Dynamic shipping fee is free above ₹1000 order value
        const finalShippingFee = subtotal > 1000 ? 0 : shippingFee;
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
        const payableAmount = Math.max(0, subtotal + finalShippingFee - discountAmount);
        const order = await prisma_1.default.$transaction(async (tx) => {
            const created = await tx.order.create({
                data: {
                    orderNumber: generateOrderNumber(),
                    userId,
                    addressId: deliveryAddress.id,
                    totalAmount: subtotal,
                    discountAmount,
                    shippingFee: finalShippingFee,
                    payableAmount,
                    paymentMethod: paymentMethod === 'COD' ? 'COD' : 'COD',
                    paymentStatus: 'PENDING',
                    status: 'PLACED',
                    latitude: latitude ? Number(latitude) : null,
                    longitude: longitude ? Number(longitude) : null,
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
        // Broadcast new order real-time event via WebSocket
        try {
            const orderForSocket = await prisma_1.default.order.findUnique({
                where: { id: order.id },
                include: {
                    user: { select: { name: true, phone: true, email: true } },
                    address: true,
                    items: {
                        include: {
                            product: { select: { name: true } }
                        }
                    }
                }
            });
            if (orderForSocket) {
                (0, socketService_1.emitNewOrder)(orderForSocket);
            }
        }
        catch (err) {
            console.error("Socket emit failed", err);
        }
        // Trigger email alerts asynchronously
        try {
            (0, notificationService_1.sendConfirmationEmail)({
                email: user.email,
                orderNumber: order.orderNumber,
                payableAmount: order.payableAmount,
                items: order.items,
                shippingFee: order.shippingFee,
                discountAmount: order.discountAmount,
                totalAmount: order.totalAmount,
                deliveryAddress: `${deliveryAddress.line1}, ${deliveryAddress.city} - ${deliveryAddress.pincode}`,
                phone: deliveryAddress.phone,
                orderId: order.id,
                latitude: order.latitude,
                longitude: order.longitude
            }).catch((err) => console.error("Async email send failed:", err));
        }
        catch (err) {
            console.error("Nodemailer trigger failed", err);
        }
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
        // Check if the user is an admin or the owner of the order
        if (req.user?.role !== 'ADMIN' && req.user?.role !== 'CHIEF_ADMIN' && order.userId !== req.user?.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized access to this order' });
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
