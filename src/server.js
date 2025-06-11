const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const errorHandler = require('./middleware/errorHandler');
const config = require('./config/config');
require('./config/database'); // Initialize database connection
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Swagger setup
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API',
      version: '1.0.0',
      description: 'API documentation for the Todo app',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Database connected successfully');

    // Middleware
    const app = express();
    
    // Configure CORS
    app.use(cors({
      origin: 'http://localhost:3001', // React development server
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    
    app.use(express.json());

    // Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Serve static files from the public directory
    app.use(express.static(path.join(__dirname, '../public')));

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/todos', todoRoutes);

    // Serve index.html for all other routes (SPA support)
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    // Error handling middleware
    app.use(errorHandler);

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 