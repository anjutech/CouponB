import express from 'express';
import  {create, deleteProduct,  getAllProducts, getProductById, update}  from '../controllers/productController.js';
import { validateProductIdParam } from '../middlewares/productValidation.js';
import { authenticateToken } from '../middlewares/authenticateRoutesByJWT.js';

const router = express.Router();

// Crud for product 
router.post('/', 
    // validateCreateProduct
    authenticateToken,
    create);
router.get('/', getAllProducts);
router.get('/:id', validateProductIdParam,getProductById);
router.put('/update',authenticateToken,update);
router.delete('/:id', validateProductIdParam,deleteProduct);
export default router;