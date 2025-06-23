
import { body, validationResult } from 'express-validator';

export const bankPaymentValidationRules = [
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
    .trim()
    .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/)
    .withMessage('upiID must be a valid UPI ID format'),
  
  body('upiProvider')
    .if(body('paymentType').equals('UPI'))
    .optional()
    .isString()
    .withMessage('upiProvider must be a string')
    .trim()
];


export const validateBankPayment = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
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
};
