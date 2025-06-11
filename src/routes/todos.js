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

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Todo management
 */

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *     responses:
 *       201:
 *         description: Todo created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all todos for the current user
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: Filter by completion status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter by priority
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title or description
 *     responses:
 *       200:
 *         description: List of todos
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get a single todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The todo ID
 *     responses:
 *       200:
 *         description: The todo item
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Todo not found
 */
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

/**
 * @swagger
 * /api/todos/{id}:
 *   patch:
 *     summary: Update a todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Todo updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Todo not found
 */
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

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The todo ID
 *     responses:
 *       200:
 *         description: Todo deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Todo not found
 */
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