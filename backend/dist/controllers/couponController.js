"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCoupon = exports.createCoupon = exports.getCoupons = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getCoupons = async (req, res, next) => {
    try {
        const coupons = await prisma_1.default.coupon.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ success: true, data: coupons });
    }
    catch (error) {
        next(error);
    }
};
exports.getCoupons = getCoupons;
const createCoupon = async (req, res, next) => {
    try {
        const data = req.body;
        const coupon = await prisma_1.default.coupon.create({
            data: {
                ...data,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate)
            }
        });
        res.status(201).json({ success: true, message: 'Coupon created successfully', data: coupon });
    }
    catch (error) {
        next(error);
    }
};
exports.createCoupon = createCoupon;
const validateCoupon = async (req, res, next) => {
    try {
        const { code, orderValue } = req.body;
        const coupon = await prisma_1.default.coupon.findUnique({ where: { code } });
        if (!coupon || !coupon.isActive) {
            return res.status(404).json({ success: false, message: 'Invalid or inactive coupon' });
        }
        const now = new Date();
        if (now < coupon.startDate || now > coupon.endDate) {
            return res.status(400).json({ success: false, message: 'Coupon has expired or is not yet active' });
        }
        if (orderValue < coupon.minOrderValue) {
            return res.status(400).json({ success: false, message: `Minimum order value of ₹${coupon.minOrderValue} required` });
        }
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
        }
        let discountAmount = 0;
        if (coupon.type === 'PERCENTAGE') {
            discountAmount = (orderValue * coupon.value) / 100;
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                discountAmount = coupon.maxDiscount;
            }
        }
        else {
            discountAmount = coupon.value;
        }
        res.status(200).json({
            success: true,
            message: 'Coupon applied successfully',
            data: {
                code: coupon.code,
                discountAmount,
                type: coupon.type,
                value: coupon.value
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.validateCoupon = validateCoupon;
