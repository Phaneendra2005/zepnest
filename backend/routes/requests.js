const { Router } = require('express');
const { body } = require('express-validator');
const {
  listRequests,
  getRequest,
  createRequest,
  updateStatus,
  deleteRequest,
} = require('../controllers/requestController');
const { authenticateJWT } = require('../middleware/auth');
const { checkOwnership } = require('../middleware/ownership');
const { validate } = require('../middleware/validate');
const upload = require('../config/multer');

const router = Router();

// All routes in this file require a valid JWT
router.use(authenticateJWT);

/**
 * @swagger
 * tags:
 *   name: Requests
 *   description: Service request management
 */

/**
 * @swagger
 * /requests:
 *   get:
 *     summary: List all service requests for the authenticated user
 *     tags: [Requests]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, 'In Progress', Completed, Cancelled]
 *     responses:
 *       200:
 *         description: Paginated list of requests
 *       401:
 *         description: Unauthorized
 */
router.get('/', listRequests);

/**
 * @swagger
 * /requests/{id}:
 *   get:
 *     summary: Get a single service request by ID
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Service request detail
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.get('/:id', getRequest);

/**
 * @swagger
 * /requests:
 *   post:
 *     summary: Create a new service request
 *     tags: [Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, description, category, address, preferred_time]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [Plumbing, Electrical, Cleaning, Carpentry, Other]
 *               address:
 *                 type: string
 *               preferred_time:
 *                 type: string
 *                 format: date-time
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Validation error
 */
router.post(
  '/',
  upload.single('image'),
  [
    body('title').trim().notEmpty().withMessage('Title is required.').isLength({ max: 200 }),
    body('description').trim().notEmpty().withMessage('Description is required.'),
    body('category')
      .isIn(['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Other'])
      .withMessage('Category must be one of: Plumbing, Electrical, Cleaning, Carpentry, Other.'),
    body('address').trim().notEmpty().withMessage('Address is required.'),
    body('preferred_time').isISO8601().withMessage('preferred_time must be a valid ISO 8601 date.'),
  ],
  validate,
  createRequest
);

/**
 * @swagger
 * /requests/{id}/status:
 *   patch:
 *     summary: Update the status of a service request
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, 'In Progress', Completed, Cancelled]
 *     responses:
 *       200:
 *         description: Status updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.patch(
  '/:id/status',
  checkOwnership,
  [
    body('status')
      .isIn(['Pending', 'In Progress', 'Completed', 'Cancelled'])
      .withMessage('Status must be one of: Pending, In Progress, Completed, Cancelled.'),
  ],
  validate,
  updateStatus
);

/**
 * @swagger
 * /requests/{id}:
 *   delete:
 *     summary: Delete a service request
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.delete('/:id', checkOwnership, deleteRequest);

module.exports = router;
