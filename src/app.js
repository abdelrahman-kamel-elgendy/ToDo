const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Error handling
app.use(errorHandler);

module.exports = app; 