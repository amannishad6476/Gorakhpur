const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { sendEmail } = require('../config/email');
const { isStrongPassword, isValidEmail } = require('../utils/validation');
const { signToken, getJwtSecret } = require('../config/jwt');
const { toLegacyDoc } = require('../utils/format');

// Precomputed dummy hash for timing attack mitigation during invalid login attempts
const DUMMY_HASH = '$2a$12$e8m4QWl3m9bCjH5Vq8sPueYy5Z1f8sHqI2Jk7k2m5a4c9b8d7e6f0';

const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user.id);
  const isProduction = process.env.NODE_ENV === 'production';
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/',
  };

  const userObj = toLegacyDoc({ ...user });
  delete userObj.password;

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: userObj,
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ success: false, message: 'Please provide email and password.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  if (!isValidEmail(cleanEmail)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

  if (!user) {
    // Constant-time dummy comparison to mitigate timing attacks
    await bcrypt.compare(password, DUMMY_HASH);
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  if (!user.isActive) {
    return res.status(403).json({ success: false, message: 'Account is deactivated. Please contact support.' });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { updatedAt: new Date() },
  });

  sendTokenResponse(user, 200, res);
};

exports.logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', 'none', {
    expires: new Date(0),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/',
  });
  res.json({ success: true, message: 'Logged out successfully.' });
};

exports.getMe = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }
  const userObj = toLegacyDoc(user);
  delete userObj.password;
  res.json({ success: true, user: userObj });
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
    return res.status(400).json({ success: false, message: 'Current and new password are required.' });
  }

  if (!isStrongPassword(newPassword)) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 12 characters and include uppercase, lowercase, number, and special character.',
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  sendTokenResponse(updatedUser, 200, res);
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user) {
    return res.json({ success: true, message: 'If an account exists for that email, password reset instructions have been sent.' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOTP = await bcrypt.hash(otp, 10);

  await prisma.oTP.create({
    data: {
      email: user.email,
      otp: hashedOTP,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    },
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
  if (!email || !otp || typeof email !== 'string' || typeof otp !== 'string') {
    return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
  }

  const otpRecords = await prisma.oTP.findMany({
    where: {
      email: email.toLowerCase().trim(),
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  let validRecord = null;
  for (const record of otpRecords) {
    const isValid = await bcrypt.compare(otp.trim(), record.otp);
    if (isValid) {
      validRecord = record;
      break;
    }
  }

  if (!validRecord) {
    return res.status(400).json({ success: false, message: 'OTP is invalid or has expired.' });
  }

  // Delete used OTP
  await prisma.oTP.deleteMany({
    where: { email: email.toLowerCase().trim() },
  });

  const resetToken = jwt.sign({ email: validRecord.email }, getJwtSecret(), { expiresIn: '10m' });
  res.json({ success: true, resetToken });
};

exports.resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword || typeof resetToken !== 'string' || typeof newPassword !== 'string') {
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
    const user = await prisma.user.findUnique({ where: { email: decoded.email } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    sendTokenResponse(updatedUser, 200, res);
  } catch (error) {
    res.status(400).json({ success: false, message: 'Reset token is invalid or expired.' });
  }
};
