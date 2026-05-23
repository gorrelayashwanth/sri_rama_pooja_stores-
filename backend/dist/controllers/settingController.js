"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.getSettings = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getSettings = async (req, res, next) => {
    try {
        let settings = await prisma_1.default.setting.findUnique({
            where: { id: 'singleton' }
        });
        if (!settings) {
            settings = await prisma_1.default.setting.create({
                data: { id: 'singleton' }
            });
        }
        res.status(200).json({ success: true, data: settings });
    }
    catch (error) {
        next(error);
    }
};
exports.getSettings = getSettings;
const updateSettings = async (req, res, next) => {
    try {
        const data = req.body;
        const settings = await prisma_1.default.setting.upsert({
            where: { id: 'singleton' },
            update: data,
            create: { ...data, id: 'singleton' }
        });
        res.status(200).json({ success: true, message: 'Settings updated successfully', data: settings });
    }
    catch (error) {
        next(error);
    }
};
exports.updateSettings = updateSettings;
