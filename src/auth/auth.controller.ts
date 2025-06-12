import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Email already exists or validation error' })
  async register(@Body() registerDto: z.infer<typeof registerSchema>) {
    try {
      const validatedData = registerSchema.parse(registerDto);
      return this.authService.register(
        validatedData.email,
        validatedData.password,
        validatedData.name,
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

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: z.infer<typeof loginSchema>) {
    try {
      const validatedData = loginSchema.parse(loginDto);
      return this.authService.login(
        validatedData.email,
        validatedData.password,
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

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid current password' })
  async changePassword(
    @Body() changePasswordDto: z.infer<typeof changePasswordSchema>,
    @Req() req: any,
  ) {
    try {
      const validatedData = changePasswordSchema.parse(changePasswordDto);
      return this.authService.changePassword(
        req.user.id,
        validatedData.currentPassword,
        validatedData.newPassword,
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

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Return current user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Req() req: any) {
    return this.authService.getProfile(req.user.id);
  }
} 