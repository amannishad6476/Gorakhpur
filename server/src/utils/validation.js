/**
 * Input and Password validation utilities.
 * 
 * Password requirements:
 * - minimum 12 characters
 * - at least 1 uppercase letter
 * - at least 1 lowercase letter
 * - at least 1 number
 * - at least 1 special character
 */

const isStrongPassword = (password) => {
  if (typeof password !== 'string' || password.length < 12) return false;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  return hasUpper && hasLower && hasNumber && hasSpecial;
};

const isValidEmail = (email) => {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim()) && email.length <= 254;
};

const isValidSlug = (slug) => {
  if (typeof slug !== 'string') return false;
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug.trim()) && slug.length <= 150;
};

const sanitizeInput = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim();
};

module.exports = {
  isStrongPassword,
  isValidEmail,
  isValidSlug,
  sanitizeInput,
};
