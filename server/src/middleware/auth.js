const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token && req.cookies.token !== 'none') {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }

    const user = await User.findById(decoded.id).select('+isActive');

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'User not found or account deactivated.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access forbidden: insufficient admin privileges.' });
    }
    next();
  };
};

exports.protectAdmin = [
  exports.protect,
  exports.authorize('admin', 'superadmin'),
];
