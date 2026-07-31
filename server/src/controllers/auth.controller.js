const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendEmail } = require('../config/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };
  user.password = undefined;
  res.status(statusCode).cookie('token', token, options).json({ success: true, token, user });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password.' });
  }
  const user = await User.findOne({ email }).select('+password');
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
  res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
  res.json({ success: true, message: 'Logged out successfully.' });
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ success: true, user });
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
  }
  user.password = newPassword;
  await user.save();
  sendTokenResponse(user, 200, res);
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: 'No user found with that email.' });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOTP = await bcrypt.hash(otp, 10);
  await OTP.create({
    email,
    otp: hashedOTP,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });
  const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9f9f9"><h2 style="color:#1e3a5f">Password Reset OTP</h2><p>Your OTP for resetting your Munnalal Painter admin password is:</p><div style="background:#1e3a5f;color:#fff;font-size:32px;font-weight:bold;text-align:center;padding:20px;border-radius:8px;letter-spacing:8px">${otp}</div><p style="color:#666">This OTP is valid for <strong>15 minutes</strong>. Do not share it with anyone.</p></div>`;
  await sendEmail({ to: email, subject: 'Password Reset OTP - Munnalal Painter Admin', html });
  res.json({ success: true, message: 'OTP sent to your email address.' });
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const otpRecord = await OTP.findOne({ email, used: false, expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 });
  if (!otpRecord) {
    return res.status(400).json({ success: false, message: 'OTP is invalid or has expired.' });
  }
  const isValid = await bcrypt.compare(otp, otpRecord.otp);
  if (!isValid) {
    return res.status(400).json({ success: false, message: 'Invalid OTP.' });
  }
  otpRecord.used = true;
  await otpRecord.save();
  const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });
  res.json({ success: true, resetToken });
};

exports.resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    user.password = newPassword;
    await user.save();
    sendTokenResponse(user, 200, res);
  } catch {
    res.status(400).json({ success: false, message: 'Reset token is invalid or expired.' });
  }
};
