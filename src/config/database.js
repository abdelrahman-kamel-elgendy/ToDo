const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Simple connection check
prisma.$connect()
  .then(() => console.log('Connected to database'))
  .catch((error) => {
    console.error('Database connection error:', error.message);
    process.exit(1);
  });

module.exports = prisma; 