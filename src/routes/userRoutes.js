import express from 'express';
const router = express.Router();

import {   getAllUsers,   deleteUser, logoutUser, createUser, sendOtp, verifyOtpLogin} from '../controllers/userController.js';
import { validateCreateUser, validateDeleteUser, validateGenerateOtp, validateVerifyOtp } from '../middlewares/userValidation.js';
import { authenticateToken } from '../middlewares/authenticateRoutesByJWT.js';



// user table 
router.post('/send_otp',validateGenerateOtp, sendOtp);
router.post('/verify_otp',validateVerifyOtp,verifyOtpLogin)

// ----------------------------------------------------------
router.post('/logout',authenticateToken,logoutUser);
router.post('/create_user',validateCreateUser,createUser);
router.get('/', getAllUsers);
router.delete('/:id',validateDeleteUser,deleteUser);

export default router;
