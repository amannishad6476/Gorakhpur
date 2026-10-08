const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'CastError') {
    message = 'Resource not found';
    statusCode = 404;
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value for field: ${field}`;
    statusCode = 400;
  }
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors || {}).map((val) => val.message).join(', ');
    statusCode = 400;
  }
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    message = 'Invalid or expired token';
    statusCode = 401;
  }
  if (err.name === 'MulterError') {
    message = err.message || 'File upload error';
    statusCode = 400;
  }

  // Hide internal server error details in production
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'An unexpected error occurred. Please try again later.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
