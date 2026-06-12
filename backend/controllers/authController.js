const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * POST /api/auth/register
 * Creates a new user account and returns a JWT.
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ where: { email }, attributes: ['id'] });
    if (existing) {
      return sendError(res, 409, 'An account with this email already exists.');
    }

    const password_hash = await bcrypt.hash(password, 12);

    const user = await User.create({ name, email, password_hash });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return sendSuccess(
      res,
      201,
      { token, user: { id: user.id, name: user.name, email: user.email } },
      'Account created successfully.'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Authenticates a user and returns a JWT.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'name', 'email', 'password_hash'],
    });

    if (!user) {
      return sendError(res, 401, 'Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid email or password.');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return sendSuccess(
      res,
      200,
      { token, user: { id: user.id, name: user.name, email: user.email } },
      'Logged in successfully.'
    );
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
