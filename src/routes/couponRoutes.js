import express from 'express';
import { createCoupon, createScanCoupon, deleteCouponFromCouponHistory, getAllActiveCoupons, getAllActiveCouponsWithQuantity, getProductDetailsByUniqueID } from '../controllers/couponController.js';
import { validateCreateCoupon, validateGetProductByCodeId, validateScanCoupon } from '../middlewares/couponValidation.js';
import { authenticateToken } from '../middlewares/authenticateRoutesByJWT.js';
const router = express.Router();
// Coupon 
router.post('/create_coupon',validateCreateCoupon,authenticateToken,createCoupon);
router.get('/get_product/:CodeId',validateGetProductByCodeId,getProductDetailsByUniqueID)
router.get('/coupons', getAllActiveCoupons);
router.get('/coupons_with_quantity',getAllActiveCouponsWithQuantity);
router.post('/create_scan_coupon',validateScanCoupon,createScanCoupon);
router.delete('/delete_coupon_history/:id',deleteCouponFromCouponHistory);
export default router;