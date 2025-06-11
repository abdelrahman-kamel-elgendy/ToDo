const { z } = require('zod');

const createTodoSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
    description: z.string().max(500, 'Description is too long').optional(),
    dueDate: z.string().datetime().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  }),
});

const updateTodoSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid todo ID'),
  }),
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long').optional(),
    description: z.string().max(500, 'Description is too long').optional(),
    dueDate: z.string().datetime().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    completed: z.boolean().optional(),
  }),
});

const getTodoSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid todo ID'),
  }),
});

const listTodosSchema = z.object({
  query: z.object({
    page: z.string().transform(Number).pipe(z.number().min(1)).default('1'),
    limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default('10'),
    completed: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    search: z.string().optional(),
  }),
});

module.exports = {
  createTodoSchema,
  updateTodoSchema,
  getTodoSchema,
  listTodosSchema,
}; 