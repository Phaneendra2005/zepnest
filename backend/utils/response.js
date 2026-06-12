/**
 * Sends a standardized success response.
 */
const sendSuccess = (res, statusCode, data, message = '') => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Sends a standardized error response.
 */
const sendError = (res, statusCode, message, errors = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

module.exports = { sendSuccess, sendError };
