import { body, param, validationResult } from 'express-validator';



export const validateCreateProduct = [
  body('created_by').notEmpty().withMessage('created_by is required'),
  body('created_by_username').notEmpty().withMessage('created_by_username is required'),
  body('product_name').notEmpty().withMessage('product_name is required'),
  body('points')
    .notEmpty().withMessage('points is required')
    .isInt({ min: 0 }).withMessage('points must be a non-negative integer'),
  body('remarks').notEmpty().withMessage('remarks is required'),
  validateRequest
];

export const validateProductIdParam = [
  param('id')
    .notEmpty().withMessage('Product ID is required')
    .isInt().withMessage('Product ID must be an integer'),
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
