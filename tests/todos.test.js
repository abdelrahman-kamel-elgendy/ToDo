const request = require('supertest');
const app = require('../src/app');
const { createTestUser, generateToken, createTestTodo } = require('./helpers');

describe('Todo Endpoints', () => {
  let user;
  let token;

  beforeEach(async () => {
    user = await createTestUser();
    token = generateToken(user);
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const todoData = {
        title: 'New Todo',
        description: 'New Description',
        priority: 'HIGH',
        dueDate: new Date().toISOString(),
      };

      const response = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send(todoData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.todo).toHaveProperty('id');
      expect(response.body.data.todo.title).toBe(todoData.title);
      expect(response.body.data.todo.description).toBe(todoData.description);
      expect(response.body.data.todo.priority).toBe(todoData.priority);
    });

    it('should not create todo without authentication', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({
          title: 'New Todo',
          description: 'New Description',
        });

      expect(response.status).toBe(401);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/todos', () => {
    beforeEach(async () => {
      // Create multiple todos for the user
      await createTestTodo(user.id, { title: 'Todo 1' });
      await createTestTodo(user.id, { title: 'Todo 2' });
      await createTestTodo(user.id, { title: 'Todo 3' });
    });

    it('should get all todos for authenticated user', async () => {
      const response = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.todos).toHaveLength(3);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/todos?page=1&limit=2')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.todos).toHaveLength(2);
      expect(response.body.data.pagination).toHaveProperty('total');
      expect(response.body.data.pagination).toHaveProperty('pages');
    });

    it('should filter todos by priority', async () => {
      await createTestTodo(user.id, { priority: 'HIGH' });

      const response = await request(app)
        .get('/api/todos?priority=HIGH')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.todos.every(todo => todo.priority === 'HIGH')).toBe(true);
    });
  });

  describe('GET /api/todos/:id', () => {
    let todo;

    beforeEach(async () => {
      todo = await createTestTodo(user.id);
    });

    it('should get a specific todo', async () => {
      const response = await request(app)
        .get(`/api/todos/${todo.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.todo).toHaveProperty('id', todo.id);
    });

    it('should not get todo of another user', async () => {
      const otherUser = await createTestUser({ email: 'other@example.com' });
      const otherTodo = await createTestTodo(otherUser.id);

      const response = await request(app)
        .get(`/api/todos/${otherTodo.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/todos/:id', () => {
    let todo;

    beforeEach(async () => {
      // Create a todo for the user
      todo = await createTestTodo(user.id, {
        title: 'Test Todo',
        description: 'Test Description',
        priority: 'MEDIUM'
      });
    });

    it('should update a todo', async () => {
      const updateData = {
        title: 'Updated Todo',
        description: 'Updated Description',
        priority: 'LOW',
      };

      const response = await request(app)
        .patch(`/api/todos/${todo.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.todo.title).toBe(updateData.title);
      expect(response.body.data.todo.description).toBe(updateData.description);
      expect(response.body.data.todo.priority).toBe(updateData.priority);
    });

    it('should not update todo of another user', async () => {
      const otherUser = await createTestUser({ email: 'other@example.com' });
      const otherTodo = await createTestTodo(otherUser.id);

      const response = await request(app)
        .patch(`/api/todos/${otherTodo.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated Todo' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    let todo;

    beforeEach(async () => {
      todo = await createTestTodo(user.id);
    });

    it('should delete a todo', async () => {
      const response = await request(app)
        .delete(`/api/todos/${todo.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);

      // Verify todo is deleted
      const getResponse = await request(app)
        .get(`/api/todos/${todo.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(getResponse.status).toBe(404);
    });

    it('should not delete todo of another user', async () => {
      const otherUser = await createTestUser({ email: 'other@example.com' });
      const otherTodo = await createTestTodo(otherUser.id);

      const response = await request(app)
        .delete(`/api/todos/${otherTodo.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });
}); 