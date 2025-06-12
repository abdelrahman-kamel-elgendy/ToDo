import { z } from 'zod';
import { Priority } from '@prisma/client';

export const createTodoSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
    description: z.string().max(500, 'Description is too long').optional(),
    dueDate: z.string().datetime().optional(),
    priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
  }),
});

export const updateTodoSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid todo ID'),
  }),
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long').optional(),
    description: z.string().max(500, 'Description is too long').optional(),
    dueDate: z.string().datetime().optional(),
    priority: z.nativeEnum(Priority).optional(),
    completed: z.boolean().optional(),
  }),
});

export const getTodoSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid todo ID'),
  }),
});

export const listTodosSchema = z.object({
  query: z.object({
    page: z.string().transform(Number).pipe(z.number().min(1)).default('1'),
    limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default('10'),
    completed: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
    priority: z.nativeEnum(Priority).optional(),
    search: z.string().optional(),
  }),
});

// Type inference for request bodies and params
export type CreateTodoBody = z.infer<typeof createTodoSchema>['body'];
export type UpdateTodoBody = z.infer<typeof updateTodoSchema>['body'];
export type UpdateTodoParams = z.infer<typeof updateTodoSchema>['params'];
export type GetTodoParams = z.infer<typeof getTodoSchema>['params'];
export type ListTodosQuery = z.infer<typeof listTodosSchema>['query']; 