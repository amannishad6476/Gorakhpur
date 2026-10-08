const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: JWT_SECRET environment variable must be set in production!');
    }
    return 'dev_jwt_secret_munnalal_gorakhpur_2026_secure_key';
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
