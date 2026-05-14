import { Router } from 'express';
import { 
  getProducts, 
  getProductBySlug, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  toggleAvailability 
} from '../controllers/productController';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Protected Admin Routes
router.post('/', authenticate, authorizeAdmin, createProduct);
router.put('/:id', authenticate, authorizeAdmin, updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, deleteProduct);
router.patch('/:id/availability', authenticate, authorizeAdmin, toggleAvailability);

export default router;