exports.errorHandler = (err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'An unexpected error occurred.' });
};
