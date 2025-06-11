const express = require('express');
const router = express.Router();
const { prisma } = require('../lib/prisma');
const validateRequest = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { AppError } = require('../utils/errors');
const {
  createTodoSchema,
  updateTodoSchema,
  getTodoSchema,
  listTodosSchema
} = require('../validations/todo');

// Create a new todo
router.post('/', protect, validateRequest(createTodoSchema), async (req, res, next) => {
  try {
    const { title, description, dueDate, priority } = req.validatedData.body;
    const userId = req.user.id;

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority,
        userId
      }
    });

    res.status(201).json({
      status: 'success',
      data: { todo }
    });
  } catch (error) {
    next(error);
  }
});

// Get all todos for the current user
router.get('/', protect, validateRequest(listTodosSchema), async (req, res, next) => {
  try {
    const { page, limit, completed, priority, search } = req.validatedData.query;
    const userId = req.user.id;

    const where = {
      userId,
      ...(completed !== undefined && { completed }),
      ...(priority && { priority }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [todos, total] = await Promise.all([
      prisma.todo.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.todo.count({ where })
    ]);

    res.json({
      status: 'success',
      data: {
        todos,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get a single todo
router.get('/:id', protect, validateRequest(getTodoSchema), async (req, res, next) => {
  try {
    const { id } = req.validatedData.params;
    const userId = req.user.id;

    const todo = await prisma.todo.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!todo) {
      throw new AppError('Todo not found', 404);
    }

    res.json({
      status: 'success',
      data: { todo }
    });
  } catch (error) {
    next(error);
  }
});

// Update a todo
router.patch('/:id', protect, validateRequest(updateTodoSchema), async (req, res, next) => {
  try {
    const { id } = req.validatedData.params;
    const { title, description, dueDate, priority, completed } = req.validatedData.body;
    const userId = req.user.id;

    const todo = await prisma.todo.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!todo) {
      throw new AppError('Todo not found', 404);
    }

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(priority && { priority }),
        ...(completed !== undefined && { completed })
      }
    });

    res.json({
      status: 'success',
      data: { todo: updatedTodo }
    });
  } catch (error) {
    next(error);
  }
});

// Delete a todo
router.delete('/:id', protect, validateRequest(getTodoSchema), async (req, res, next) => {
  try {
    const { id } = req.validatedData.params;
    const userId = req.user.id;

    const todo = await prisma.todo.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!todo) {
      throw new AppError('Todo not found', 404);
    }

    await prisma.todo.delete({
      where: { id }
    });

    res.json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 