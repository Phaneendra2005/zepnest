const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Zepnest API',
      version: '1.0.0',
      description: 'Service Request Management API for the Zepnest home-services platform.',
      contact: { name: 'Zepnest Team' },
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 5000}/api` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        ServiceRequest: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            category: { type: 'string', enum: ['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Other'] },
            address: { type: 'string' },
            preferred_time: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'] },
            image_url: { type: 'string', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
