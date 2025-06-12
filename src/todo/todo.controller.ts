import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Priority } from '@prisma/client';
import { z } from 'zod';

const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
  dueDate: z.string().datetime().optional(),
});

const updateTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long').optional(),
  description: z.string().max(500, 'Description is too long').optional(),
  priority: z.nativeEnum(Priority).optional(),
  dueDate: z.string().datetime().optional(),
  completed: z.boolean().optional(),
});

const listTodosSchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  completed: z.string().transform(val => val === 'true').optional(),
  priority: z.nativeEnum(Priority).optional(),
  search: z.string().optional(),
});

@ApiTags('todos')
@Controller('todos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiResponse({ status: 201, description: 'Todo created successfully' })
  async createTodo(
    @Body() createTodoDto: z.infer<typeof createTodoSchema>,
    @Req() req: any,
  ) {
    try {
      const validatedData = createTodoSchema.parse(createTodoDto);
      return this.todoService.createTodo(req.user.id, {
        title: validatedData.title,
        description: validatedData.description,
        priority: validatedData.priority,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new HttpException({
          status: 'error',
          message: 'Validation error',
          errors: error.errors,
        }, HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'List all todos' })
  @ApiResponse({ status: 200, description: 'Return list of todos' })
  async getTodos(
    @Query() query: z.infer<typeof listTodosSchema>,
    @Req() req: any,
  ) {
    try {
      const validatedData = listTodosSchema.parse(query);
      return this.todoService.getTodosWithPagination(
        req.user.id,
        validatedData.page,
        validatedData.limit,
        validatedData.completed,
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new HttpException({
          status: 'error',
          message: 'Validation error',
          errors: error.errors,
        }, HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific todo' })
  @ApiResponse({ status: 200, description: 'Return the todo' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async getTodo(@Param('id') id: string, @Req() req: any) {
    return this.todoService.getTodoById(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a todo' })
  @ApiResponse({ status: 200, description: 'Todo updated successfully' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async updateTodo(
    @Param('id') id: string,
    @Body() updateTodoDto: z.infer<typeof updateTodoSchema>,
    @Req() req: any,
  ) {
    try {
      const validatedData = updateTodoSchema.parse(updateTodoDto);
      return this.todoService.updateTodo(id, req.user.id, {
        ...validatedData,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new HttpException({
          status: 'error',
          message: 'Validation error',
          errors: error.errors,
        }, HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo' })
  @ApiResponse({ status: 200, description: 'Todo deleted successfully' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async deleteTodo(@Param('id') id: string, @Req() req: any) {
    return this.todoService.deleteTodo(id, req.user.id);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Toggle todo completion status' })
  @ApiResponse({ status: 200, description: 'Todo status toggled successfully' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async toggleTodoStatus(@Param('id') id: string, @Req() req: any) {
    return this.todoService.toggleTodoStatus(id, req.user.id);
  }
} 