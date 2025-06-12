import { Todo, Priority } from '@prisma/client';

export interface CreateTodoData {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: Date;
  userId: string;
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: Date;
  completed?: boolean;
}

export interface ITodoRepository {
  create(todoData: CreateTodoData): Promise<Todo>;
  findAll(userId: string): Promise<Todo[]>;
  findById(id: string, userId: string): Promise<Todo | null>;
  update(id: string, userId: string, updates: UpdateTodoData): Promise<Todo>;
  delete(id: string, userId: string): Promise<Todo>;
} 