"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleBlockUser = exports.getUsers = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const [users, total] = await Promise.all([
            prisma_1.default.user.findMany({
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { orders: true }
                    }
                }
            }),
            prisma_1.default.user.count()
        ]);
        res.status(200).json({
            success: true,
            data: users,
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
exports.getUsers = getUsers;
const toggleBlockUser = async (req, res, next) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const user = await prisma_1.default.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const updatedUser = await prisma_1.default.user.update({
            where: { id },
            data: { isBlocked: !user.isBlocked }
        });
        res.status(200).json({
            success: true,
            message: `User ${updatedUser.isBlocked ? 'blocked' : 'unblocked'} successfully`,
            data: updatedUser
        });
    }
    catch (error) {
        next(error);
    }
};
exports.toggleBlockUser = toggleBlockUser;
