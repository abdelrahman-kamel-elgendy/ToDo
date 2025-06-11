const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const createTestUser = async (userData = {}) => {
  const defaultUser = {
    email: 'test@example.com',
    password: 'Password123!',
    name: 'Test User'
  };

  const user = {
    ...defaultUser,
    ...userData,
    password: await bcrypt.hash(userData.password || defaultUser.password, 10)
  };

  return prisma.user.create({
    data: user
  });
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1h' }
  );
};

const createTestTodo = async (userId, todoData = {}) => {
  const defaultTodo = {
    title: 'Test Todo',
    description: 'Test Description',
    priority: 'MEDIUM',
    dueDate: new Date(),
    completed: false
  };

  return prisma.todo.create({
    data: {
      ...defaultTodo,
      ...todoData,
      userId
    }
  });
};

module.exports = {
  createTestUser,
  generateToken,
  createTestTodo
}; 