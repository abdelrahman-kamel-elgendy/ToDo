import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ITodoRepository, CreateTodoData, UpdateTodoData } from './interfaces/ITodoRepository';
import { Todo } from '@prisma/client';

@Injectable()
export class PrismaTodoRepository implements ITodoRepository {
  constructor(private prisma: PrismaService) {}

  async create(todoData: CreateTodoData): Promise<Todo> {
    return this.prisma.todo.create({
      data: todoData,
    });
  }

  async findAll(userId: string): Promise<Todo[]> {
    return this.prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId: string): Promise<Todo | null> {
    return this.prisma.todo.findFirst({
      where: { id, userId },
    });
  }

  async update(id: string, userId: string, updates: UpdateTodoData): Promise<Todo> {
    return this.prisma.todo.update({
      where: { id },
      data: updates,
    });
  }

  async delete(id: string, userId: string): Promise<Todo> {
    return this.prisma.todo.delete({
      where: { id },
    });
  }
} 