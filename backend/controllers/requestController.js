const { Op } = require('sequelize');
const { ServiceRequest, User } = require('../models');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * GET /api/requests
 * Lists paginated service requests for the authenticated user.
 * Query params: page, limit, search, status
 */
const listRequests = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const offset = (page - 1) * limit;
    const { search, status } = req.query;

    const where = { user_id: req.user.id };

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const { count, rows } = await ServiceRequest.findAndCountAll({
      where,
      attributes: ['id', 'title', 'category', 'address', 'preferred_time', 'status', 'image_url', 'created_at', 'updated_at'],
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    return sendSuccess(res, 200, {
      requests: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/requests/:id
 * Returns a single service request (ownership enforced).
 */
const getRequest = async (req, res, next) => {
  try {
    const request = await ServiceRequest.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'user_id', 'title', 'description', 'category', 'address',
                   'preferred_time', 'status', 'image_url', 'created_at', 'updated_at'],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email'],
      }],
    });

    if (!request) {
      return sendError(res, 404, 'Service request not found.');
    }

    if (request.user_id !== req.user.id) {
      return sendError(res, 403, 'You do not have permission to view this request.');
    }

    return sendSuccess(res, 200, { request });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/requests
 * Creates a new service request (supports multipart/form-data for image).
 */
const createRequest = async (req, res, next) => {
  try {
    const { title, description, category, address, preferred_time } = req.body;

    let image_url = null;
    if (req.file) {
      // Build a publicly accessible URL for the uploaded image
      image_url = `/uploads/${req.file.filename}`;
    }

    const request = await ServiceRequest.create({
      user_id: req.user.id,
      title,
      description,
      category,
      address,
      preferred_time,
      image_url,
    });

    return sendSuccess(res, 201, { request }, 'Service request created successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/requests/:id/status
 * Updates only the status field (ownership enforced via middleware).
 */
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const request = req.serviceRequest; // attached by checkOwnership middleware

    await request.update({ status });

    return sendSuccess(res, 200, { request }, 'Status updated successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/requests/:id
 * Deletes a service request (ownership enforced via middleware).
 */
const deleteRequest = async (req, res, next) => {
  try {
    const request = req.serviceRequest; // attached by checkOwnership middleware
    await request.destroy();

    return sendSuccess(res, 200, null, 'Service request deleted successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = { listRequests, getRequest, createRequest, updateStatus, deleteRequest };
