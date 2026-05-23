"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContent = exports.getContent = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getContent = async (req, res, next) => {
    try {
        let content = await prisma_1.default.content.findUnique({
            where: { id: 'singleton' }
        });
        if (!content) {
            content = await prisma_1.default.content.create({
                data: { id: 'singleton' }
            });
        }
        res.status(200).json({ success: true, data: content });
    }
    catch (error) {
        next(error);
    }
};
exports.getContent = getContent;
const updateContent = async (req, res, next) => {
    try {
        const data = req.body;
        const content = await prisma_1.default.content.upsert({
            where: { id: 'singleton' },
            update: data,
            create: { ...data, id: 'singleton' }
        });
        res.status(200).json({ success: true, message: 'Content updated successfully', data: content });
    }
    catch (error) {
        next(error);
    }
};
exports.updateContent = updateContent;
