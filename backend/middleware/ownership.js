const { ServiceRequest } = require('../models');
const { sendError } = require('../utils/response');

/**
 * Ensures the service request identified by :id belongs to req.user.
 * Attaches the found request to req.serviceRequest for downstream use.
 */
const checkOwnership = async (req, res, next) => {
  try {
    const request = await ServiceRequest.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'user_id', 'title', 'description', 'category', 'address',
                   'preferred_time', 'status', 'image_url', 'created_at', 'updated_at'],
    });

    if (!request) {
      return sendError(res, 404, 'Service request not found.');
    }

    if (request.user_id !== req.user.id) {
      return sendError(res, 403, 'You do not have permission to modify this request.');
    }

    req.serviceRequest = request;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { checkOwnership };
