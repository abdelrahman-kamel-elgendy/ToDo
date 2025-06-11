require('dotenv').config();

module.exports = {
  app: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  database: {
    url: process.env.DATABASE_URL
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
}; 