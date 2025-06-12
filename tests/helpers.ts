import jwt from 'jsonwebtoken';
import { PrismaClient, User, Todo, Priority } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface UserData {
  email?: string;
  password?: string;
  name?: string;
}

interface TodoData {
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: Date;
  completed?: boolean;
}

export const createTestUser = async (userData: UserData = {}): Promise<User> => {
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

export const generateToken = (user: User): string => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1h' }
  );
};

export const createTestTodo = async (userId: string, todoData: TodoData = {}): Promise<Todo> => {
  const defaultTodo = {
    title: 'Test Todo',
    description: 'Test Description',
    priority: Priority.MEDIUM,
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