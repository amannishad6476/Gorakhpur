/**
 * Password strength validator.
 * Requirements:
 * - Minimum 12 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character
 */
const isStrongPassword = (password) => {
  if (typeof password !== 'string' || password.length < 12) return false;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  return hasUpper && hasLower && hasNumber && hasSpecial;
};

const sanitizeInput = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim();
};

module.exports = {
  isStrongPassword,
  sanitizeInput,
};
