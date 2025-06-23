import express from 'express';
import { payment } from '../controllers/paymentController.js';
import { bankPaymentValidationRules, validateBankPayment } from '../middlewares/bankPaymentValidator.js';
import { authenticateToken } from '../middlewares/authenticateRoutesByJWT.js';
const router = express.Router();

router.post('/payment',
  bankPaymentValidationRules,
  validateBankPayment,
  authenticateToken,
  payment);

export default router;