const { validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

/**
 * Runs after express-validator chains and returns 400 if any errors exist.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    return sendError(res, 400, 'Validation failed.', formatted);
  }
  next();
};

module.exports = { validate };
