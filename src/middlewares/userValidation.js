import { body, param, validationResult } from 'express-validator';



export const validateGenerateOtp = [
  body('mobile')
    .notEmpty().withMessage('Mobile number is required')
    .isMobilePhone().withMessage('Invalid mobile number'),
  validateRequest
];

export const validateVerifyOtp = [
  body('mobile')
    .notEmpty().withMessage('Mobile number is required')
    .isMobilePhone().withMessage('Invalid mobile number'),
  body('otp')
    .notEmpty().withMessage('OTP is required')
    .isNumeric().withMessage('OTP must be a number'),
  validateRequest
];

export const validateCreateUser = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),
  body('mobile')
    .notEmpty().withMessage('Mobile number is required')
    .isMobilePhone().withMessage('Invalid mobile number'),
  validateRequest
];

export const validateDeleteUser = [
  param('id')
    .notEmpty().withMessage('User ID is required')
    .isInt().withMessage('User ID must be an integer'),
  validateRequest
];


function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
}
