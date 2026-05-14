"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImages = exports.uploadImage = void 0;
const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        const file = req.file;
        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                url: file.path,
                publicId: file.filename
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.uploadImage = uploadImage;
const uploadImages = async (req, res, next) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
        }
        const images = files.map(file => ({
            url: file.path,
            publicId: file.filename
        }));
        res.status(201).json({
            success: true,
            message: 'Images uploaded successfully',
            data: images
        });
    }
    catch (error) {
        next(error);
    }
};
exports.uploadImages = uploadImages;
