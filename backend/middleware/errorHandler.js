const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message}`, { stack: err.stack, url: req.originalUrl });

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors,
    });
  }

  // JWT errors (shouldn't normally reach here, but safety net)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Authentication error.',
      errors: [],
    });
  }

  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'An unexpected error occurred.' : err.message,
    errors: [],
  });
};

module.exports = { errorHandler };
