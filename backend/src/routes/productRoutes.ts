import { Router } from 'express';
import { 
  getProducts, 
  getProductBySlug, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  toggleAvailability,
  importProductsBulk,
  generateImage
} from '../controllers/productController';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Protected Admin Routes
router.post('/bulk', authenticate, authorizeAdmin, importProductsBulk);
router.post('/:id/generate-image', authenticate, authorizeAdmin, generateImage);
router.post('/', authenticate, authorizeAdmin, createProduct);
router.put('/:id', authenticate, authorizeAdmin, updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, deleteProduct);
router.patch('/:id/availability', authenticate, authorizeAdmin, toggleAvailability);

export default router;