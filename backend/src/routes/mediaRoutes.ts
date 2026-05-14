import { Router } from 'express';
import { uploadImage, uploadImages } from '../controllers/mediaController';
import { upload } from '../middleware/uploadMiddleware';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();

router.post('/upload', authenticate, authorizeAdmin, upload.single('image'), uploadImage);
router.post('/upload-multiple', authenticate, authorizeAdmin, upload.array('images', 10), uploadImages);

export default router;