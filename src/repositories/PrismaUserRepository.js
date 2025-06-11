const prisma = require('../config/database');
const IUserRepository = require('./interfaces/IUserRepository');

class PrismaUserRepository extends IUserRepository {
  async create(userData) {
    return prisma.user.create({
      data: userData
    });
  }

  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  async findById(id) {
    return prisma.user.findUnique({
      where: { id }
    });
  }
}

module.exports = PrismaUserRepository; 