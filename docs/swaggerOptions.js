const swaggerJSDoc = require('swagger-jsdoc');
const PORT = process.env.PORT || 5000;

// Swagger definition options
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Synonym Search API',
      version: '1.0.0',
      description: 'API documentation for Synonym Search Tool',
    },
    servers: [
      {
        url: `${process.env.APP_URL}/api` || `http://localhost:${PORT}/api`,
      },
    ],
  },
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'],
};

// Initialize SwaggerJSDoc with the options
const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = swaggerDocs;
