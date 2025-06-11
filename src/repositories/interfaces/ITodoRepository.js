class ITodoRepository {
  async create(todoData) {
    throw new Error('Method not implemented');
  }

  async findAll(userId) {
    throw new Error('Method not implemented');
  }

  async findById(id, userId) {
    throw new Error('Method not implemented');
  }

  async update(id, userId, updates) {
    throw new Error('Method not implemented');
  }

  async delete(id, userId) {
    throw new Error('Method not implemented');
  }
}

module.exports = ITodoRepository;