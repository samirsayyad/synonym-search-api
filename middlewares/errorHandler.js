const logger = require('../utils/logger');

module.exports = (err, _req, res) => {
  logger.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      message: message,
    },
  });
};
