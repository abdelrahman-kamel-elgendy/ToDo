import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Priority, Todo } from '@prisma/client';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async createTodo(
    userId: string,
    data: {
      title: string;
      description?: string;
      dueDate?: Date;
      priority?: Priority;
    },
  ): Promise<Todo> {
    return this.prisma.todo.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async getTodoById(id: string, userId: string): Promise<Todo> {
    const todo = await this.prisma.todo.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }

  async getTodosWithPagination(
    userId: string,
    page: number = 1,
    limit: number = 10,
    completed?: boolean,
  ) {
    const skip = (page - 1) * limit;
    const where = {
      userId,
      ...(completed !== undefined ? { completed } : {}),
    };

    const [todos, total] = await Promise.all([
      this.prisma.todo.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.todo.count({ where }),
    ]);

    return {
      data: todos,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateTodo(
    id: string,
    userId: string,
    data: {
      title?: string;
      description?: string;
      dueDate?: Date;
      priority?: Priority;
      completed?: boolean;
    },
  ): Promise<Todo> {
    const todo = await this.getTodoById(id, userId);

    return this.prisma.todo.update({
      where: { id: todo.id },
      data,
    });
  }

  async deleteTodo(id: string, userId: string): Promise<void> {
    const todo = await this.getTodoById(id, userId);

    await this.prisma.todo.delete({
      where: { id: todo.id },
    });
  }

  async toggleTodoStatus(id: string, userId: string): Promise<Todo> {
    const todo = await this.getTodoById(id, userId);

    return this.prisma.todo.update({
      where: { id: todo.id },
      data: {
        completed: !todo.completed,
      },
    });
  }
} 