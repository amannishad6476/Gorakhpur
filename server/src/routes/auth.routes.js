const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const { loginLimiter, otpLimiter } = require('../middleware/rateLimiter');

router.post('/login', loginLimiter, authController.login);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);
router.put('/change-password', protect, authController.changePassword);
router.post('/forgot-password', otpLimiter, authController.forgotPassword);
router.post('/verify-otp', otpLimiter, authController.verifyOTP);
router.post('/reset-password', otpLimiter, authController.resetPassword);

module.exports = router;
