const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const errorHandler = require('./middleware/errorHandler');
const config = require('./config/config');
require('./config/database'); // Initialize database connection
const app = require('./app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Database connected successfully');

    // Middleware
    const app = express();
    app.use(cors(config.cors));
    app.use(express.json());

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/todos', todoRoutes);

    // Error handling middleware
    app.use(errorHandler);

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 