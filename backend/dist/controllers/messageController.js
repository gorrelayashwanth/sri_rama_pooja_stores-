"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessage = exports.deleteMessage = exports.markAsRead = exports.getMessages = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getSingleParam = (value) => Array.isArray(value) ? value[0] : value;
const getMessages = async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const [messages, total] = await Promise.all([
            prisma_1.default.message.findMany({
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' }
            }),
            prisma_1.default.message.count()
        ]);
        res.status(200).json({
            success: true,
            data: messages,
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
exports.getMessages = getMessages;
const markAsRead = async (req, res, next) => {
    try {
        const id = getSingleParam(req.params.id);
        if (!id) {
            return res.status(400).json({ success: false, message: 'Message id is required' });
        }
        await prisma_1.default.message.update({
            where: { id },
            data: { isRead: true }
        });
        res.status(200).json({ success: true, message: 'Message marked as read' });
    }
    catch (error) {
        next(error);
    }
};
exports.markAsRead = markAsRead;
const deleteMessage = async (req, res, next) => {
    try {
        const id = getSingleParam(req.params.id);
        if (!id) {
            return res.status(400).json({ success: false, message: 'Message id is required' });
        }
        await prisma_1.default.message.delete({ where: { id } });
        res.status(200).json({ success: true, message: 'Message deleted' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteMessage = deleteMessage;
const createMessage = async (req, res, next) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        const newMessage = await prisma_1.default.message.create({
            data: { name, email, phone, subject, message }
        });
        res.status(201).json({ success: true, message: 'Message sent successfully', data: newMessage });
    }
    catch (error) {
        next(error);
    }
};
exports.createMessage = createMessage;
