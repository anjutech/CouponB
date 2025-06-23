import { body, param, validationResult } from 'express-validator';



export const validateCreateCoupon = [
  
  
  body('quantity')
    .notEmpty().withMessage('quantity is required')
    .isInt({ min: 1 }).withMessage('quantity must be a positive integer'),
  body('remarks')
    .optional()
    .isString()
    .withMessage('remarks must be a string')
    .trim()
    .isLength({ max: 500 })
    .withMessage('remarks cannot exceed 500 characters'),
  validateRequest
];

export const validateScanCoupon = [
  body('influencer_customer_name').notEmpty().withMessage('influencer_customer_name is required').isString()
    .withMessage('influencer_customer_name must be a string')
    .trim(),
  body('scanned_By_name').notEmpty().withMessage('scanned_By_name is required').isString()
    .withMessage('scanned_By_name must be a string')
    .trim(),
  body('mobile').notEmpty().withMessage('mobile is required').isMobilePhone('en-IN')
    .withMessage('mobile must be a valid Indian mobile number'),
  body('product_id').notEmpty().withMessage('product_id is required').isInt()
    .withMessage('product_id must be a Int')
    .trim(),
  body('product_name').notEmpty().withMessage('product_name is required').isString()
    .withMessage('product_name must be a string')
    .trim(),
  body('couponCode').notEmpty().withMessage('couponCode is required').isString()
    .withMessage('couponCode must be a string')
    .trim(),
  body('coupon_history_id')
    .optional()
    .isInt()
    .withMessage('coupon_history_id must be a positive integer'),
   body('CodeId')
    .optional()
    .isString()
    .withMessage('CodeId must be a string')
    .trim(),
   body('couponUrl')
    .optional()
    .isURL()
    .withMessage('couponUrl must be a valid URL'),
  body('paymentType')
    .optional()
    .isIn(['BANK', 'UPI'])
    .withMessage('paymentType must be either "BANK" or "UPI"'),   
 // Bank payment fields
  body('accountHolder')
    .if(body('paymentType').equals('BANK'))
    .notEmpty()
    .withMessage('accountHolder is required for BANK payments')
    .isString()
    .withMessage('accountHolder must be a string')
    .trim(),
  
  body('accountNumber')
    .if(body('paymentType').equals('BANK'))
    .notEmpty()
    .withMessage('accountNumber is required for BANK payments')
    .isString()
    .withMessage('accountNumber must be a string')
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage('accountNumber must be between 8 and 20 characters')
    .matches(/^[0-9]+$/)
    .withMessage('accountNumber must contain only numbers'),
  
  body('ifscCode')
    .if(body('paymentType').equals('BANK'))
    .notEmpty()
    .withMessage('ifscCode is required for BANK payments')
    .isString()
    .withMessage('ifscCode must be a string')
    .trim()
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
    .withMessage('ifscCode must be a valid IFSC code format'),
  
  body('bankName')
    .if(body('paymentType').equals('BANK'))
    .notEmpty()
    .withMessage('bankName is required for BANK payments')
    .isString()
    .withMessage('bankName must be a string')
    .trim(),
  
  // UPI payment fields
  body('upiID')
    .if(body('paymentType').equals('UPI'))
    .notEmpty()
    .withMessage('upiID is required for UPI payments')
    .isString()
    .withMessage('upiID must be a string')
    .trim(),
  
  body('upiProvider')
    .if(body('paymentType').equals('UPI'))
    .optional()
    .isString()
    .withMessage('upiProvider must be a string')
    .trim(),
  
  validateRequest
];

export const validateGetProductByCodeId = [
  param('CodeId').notEmpty().withMessage('CodeId is required'),
  validateRequest
];


function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: 'Validation failed',
      details: errors.array().map(error => ({
        field: error.path || error.param,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
}
