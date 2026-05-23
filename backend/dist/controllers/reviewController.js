"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.createReview = exports.getReviews = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getReviews = async (req, res, next) => {
    try {
        const reviews = await prisma_1.default.review.findMany({
            include: {
                user: { select: { name: true, email: true } },
                product: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ success: true, data: reviews });
    }
    catch (error) {
        next(error);
    }
};
exports.getReviews = getReviews;
const createReview = async (req, res, next) => {
    try {
        const { rating, comment, productId } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        // Check if user has ordered this product
        const order = await prisma_1.default.order.findFirst({
            where: {
                userId,
                items: {
                    some: { productId }
                },
                status: 'DELIVERED'
            }
        });
        if (!order) {
            return res.status(403).json({ success: false, message: 'You can only review products you have purchased and received' });
        }
        const review = await prisma_1.default.review.create({
            data: {
                rating: Number(rating),
                comment,
                userId,
                productId
            }
        });
        res.status(201).json({ success: true, message: 'Review submitted successfully', data: review });
    }
    catch (error) {
        next(error);
    }
};
exports.createReview = createReview;
const deleteReview = async (req, res, next) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        await prisma_1.default.review.delete({ where: { id } });
        res.status(200).json({ success: true, message: 'Review deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteReview = deleteReview;
