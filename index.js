const express = require('express');
const synonymRoutes = require('./routes/synonymRoutes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

// Routes
app.use('/api', synonymRoutes);

// Global error handler
app.use(errorHandler);

module.exports = app;
