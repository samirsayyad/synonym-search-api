require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const synonymRoutes = require('./routes/synonymRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./docs/swaggerOptions');
const errorHandler = require('./middlewares/errorHandler');

const corsOptions = {
  origin: [process.env.FRONTEND_APP_URL || 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
});

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(helmet());

// Routes

app.get('/', (req, res) => {
  res.send('Welcome to the Synonym API');
});
app.use('/api', limiter);
app.use('/api', synonymRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API docs available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;
