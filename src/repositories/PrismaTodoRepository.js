const prisma = require('../config/database');
const ITodoRepository = require('./interfaces/ITodoRepository');

class PrismaTodoRepository extends ITodoRepository {
  async create(todoData) {
    return prisma.todo.create({
      data: todoData
    });
  }

  async findAll(userId) {
    return prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id, userId) {
    return prisma.todo.findFirst({
      where: { id, userId }
    });
  }

  async update(id, userId, updates) {
    return prisma.todo.update({
      where: { id },
      data: updates
    });
  }

  async delete(id, userId) {
    return prisma.todo.delete({
      where: { id }
    });
  }
}

module.exports = PrismaTodoRepository; 