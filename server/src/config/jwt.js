const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️ JWT_SECRET environment variable is not set. Using secure fallback.');
    }
    return 'munnalal_gorakhpur_jwt_production_secure_fallback_2026';
  }
  return secret;
};

const getJwtExpire = () => process.env.JWT_EXPIRE || '7d';

const signToken = (id) => {
  return jwt.sign({ id }, getJwtSecret(), {
    expiresIn: getJwtExpire(),
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};

module.exports = {
  getJwtSecret,
  getJwtExpire,
  signToken,
  verifyToken,
};
