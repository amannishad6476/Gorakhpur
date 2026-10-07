const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendEmail } = require('../config/email');
const { isStrongPassword } = require('../utils/validation');

const getJwtSecret = () => process.env.JWT_SECRET || 'munnalal_painter_secure_jwt_fallback_key_2026';

const signToken = (id) =>
  jwt.sign({ id }, getJwtSecret(), { expiresIn: process.env.JWT_EXPIRE || '7d' });

const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: userObj,
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password.' });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  if (!user.isActive) {
    return res.status(401).json({ success: false, message: 'Account is deactivated.' });
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
};

exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ success: true, message: 'Logged out successfully.' });
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }
  res.json({ success: true, user });
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Current and new password are required.' });
  }

  if (!isStrongPassword(newPassword)) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 12 characters and include uppercase, lowercase, number, and special character.',
    });
  }

  const user = await User.findById(req.user.id).select('+password');
  if (!user || !(await user.comparePassword(currentPassword))) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide email.' });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    // Return generic success to prevent email enumeration
    return res.json({ success: true, message: 'If an account exists for that email, password reset instructions have been sent.' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOTP = await bcrypt.hash(otp, 10);

  await OTP.create({
    email: user.email,
    otp: hashedOTP,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });

  const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9f9f9"><h2 style="color:#1e3a5f">Password Reset OTP</h2><p>Your OTP for resetting your Munnalal Painter admin password is:</p><div style="background:#1e3a5f;color:#fff;font-size:32px;font-weight:bold;text-align:center;padding:20px;border-radius:8px;letter-spacing:8px">${otp}</div><p style="color:#666">This OTP is valid for <strong>15 minutes</strong>. Do not share it with anyone.</p></div>`;

  try {
    await sendEmail({ to: user.email, subject: 'Password Reset OTP - Munnalal Painter Admin', html });
  } catch (err) {
    console.error('Email send failed:', err.message);
  }

  res.json({ success: true, message: 'If an account exists for that email, password reset instructions have been sent.' });
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
  }

  const otpRecord = await OTP.findOne({
    email: email.toLowerCase().trim(),
    used: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  if (!otpRecord) {
    return res.status(400).json({ success: false, message: 'OTP is invalid or has expired.' });
  }

  const isValid = await bcrypt.compare(otp, otpRecord.otp);
  if (!isValid) {
    return res.status(400).json({ success: false, message: 'Invalid OTP.' });
  }

  otpRecord.used = true;
  await otpRecord.save();

  const resetToken = jwt.sign({ email: otpRecord.email }, getJwtSecret(), { expiresIn: '10m' });
  res.json({ success: true, resetToken });
};

exports.resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    return res.status(400).json({ success: false, message: 'Reset token and new password are required.' });
  }

  if (!isStrongPassword(newPassword)) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 12 characters and include uppercase, lowercase, number, and special character.',
    });
  }

  try {
    const decoded = jwt.verify(resetToken, getJwtSecret());
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(400).json({ success: false, message: 'Reset token is invalid or expired.' });
  }
};
