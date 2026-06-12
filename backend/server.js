require('dotenv').config();
const fs = require('fs');
const path = require('path');
const app = require('./app');
const sequelize = require('./config/database');
const logger = require('./utils/logger');

// Ensure logs and uploads directories exist
['logs', 'uploads'].forEach((dir) => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');

    // Sync models — use { alter: true } in dev to update schema automatically
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    logger.info('Database models synchronized.');

    app.listen(PORT, () => {
      logger.info(`Zepnest API running on http://localhost:${PORT}`);
      logger.info(`Swagger docs available at http://localhost:${PORT}/api/docs`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
