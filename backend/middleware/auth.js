const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response');
const { User } = require('../models');

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 401, 'Access token missing or malformed.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch fresh user to ensure they still exist
    const user = await User.findOne({
      where: { id: decoded.id },
      attributes: ['id', 'name', 'email'],
    });

    if (!user) {
      return sendError(res, 401, 'User no longer exists.');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Token has expired. Please log in again.');
    }
    return sendError(res, 401, 'Invalid token.');
  }
};

module.exports = { authenticateJWT };
