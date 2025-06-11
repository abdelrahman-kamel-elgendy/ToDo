const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Clean up database before each test
beforeEach(async () => {
  await prisma.todo.deleteMany();
  await prisma.user.deleteMany();
});

// Close Prisma connection after all tests
afterAll(async () => {
  await prisma.$disconnect();
}); 