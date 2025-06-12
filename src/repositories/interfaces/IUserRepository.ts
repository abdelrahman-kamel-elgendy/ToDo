import { User, Role } from '@prisma/client';

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role?: Role;
}

export interface IUserRepository {
  create(userData: CreateUserData): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
} 