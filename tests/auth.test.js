const request = require('supertest');
const app = require('../src/app');
const { createTestUser, generateToken } = require('./helpers');

describe('Authentication Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'Password123!',
        name: 'New User',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.name).toBe(userData.name);
      expect(response.body.data).toHaveProperty('token');
    });

    it('should not register a user with existing email', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: user.email,
          password: 'Password123!',
          name: 'Another User',
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('should validate password requirements', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'weak',
          name: 'Test User',
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: 'Password123!',
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('token');
    });

    it('should not login with invalid password', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: 'WrongPassword123!',
        });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
    });

    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!',
        });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get current user with valid token', async () => {
      const user = await createTestUser();
      const token = generateToken(user);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user).toHaveProperty('id', user.id);
      expect(response.body.data.user.email).toBe(user.email);
    });

    it('should not get current user without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
    });

    it('should not get current user with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
    });
  });
}); 