const rateLimit = require('express-rate-limit');

const isTestEnv = process.env.NODE_ENV === 'test';

exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isTestEnv ? 1000 : 5, // 5 failed attempts per 15 minutes in production
  message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTestEnv ? 5000 : 200,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isTestEnv ? 1000 : 10,
  message: { success: false, message: 'Too many submissions. Please try again after 1 hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTestEnv ? 1000 : 3,
  message: { success: false, message: 'Too many OTP requests. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
