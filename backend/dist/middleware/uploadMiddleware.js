"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const localStorePath = path_1.default.join(__dirname, '../../uploads');
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
    process.env.CLOUDINARY_CLOUD_NAME !== '';
let storage;
if (isCloudinaryConfigured) {
    storage = new multer_storage_cloudinary_1.CloudinaryStorage({
        cloudinary: cloudinary_1.default,
        params: {
            folder: 'pooja-store',
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        },
    });
}
else {
    if (!fs_1.default.existsSync(localStorePath)) {
        fs_1.default.mkdirSync(localStorePath, { recursive: true });
    }
    storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, localStorePath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = path_1.default.extname(file.originalname);
            cb(null, file.fieldname + '-' + uniqueSuffix + ext);
        }
    });
}
exports.upload = (0, multer_1.default)({ storage: storage });
