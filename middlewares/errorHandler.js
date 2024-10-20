const logger = require('../utils/logger');

module.exports = (req, res, _next, err) => {
  logger.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      message: message,
    },
  });
};
