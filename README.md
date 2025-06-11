# Todo List API

A RESTful API for a Todo List application built with Node.js, Express, Prisma, and PostgreSQL.

## Features

- 🔐 User authentication (register, login, logout)
- ✅ Create, read, update, and delete todos
- 🎯 Priority levels for todos (LOW, MEDIUM, HIGH)
- 📅 Due date support
- 📊 Pagination and filtering
- 🛡️ Input validation with Zod
- 🐳 Docker support for database
- 🧪 Comprehensive test suite
- 🔒 JWT-based authentication
- 🎨 Clean architecture with repository pattern

## Tech Stack

- Node.js & Express
- Prisma ORM
- PostgreSQL
- Zod for validation
- JWT for authentication
- Jest & Supertest for testing
- Docker for containerization

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn
- PostgreSQL (if running without Docker)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd todo-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   # Start PostgreSQL container
   docker-compose up -d

   # Run database setup
   npm run db:setup
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at http://localhost:5000

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### Todo Endpoints

#### Create Todo
```http
POST /api/todos
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the todo app",
  "dueDate": "2024-12-31T23:59:59Z",
  "priority": "HIGH"
}
```

#### List Todos
```http
GET /api/todos?page=1&limit=10&completed=false&priority=HIGH&search=project
Authorization: Bearer <token>
```

#### Update Todo
```http
PATCH /api/todos/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "completed": true
}
```

#### Delete Todo
```http
DELETE /api/todos/:id
Authorization: Bearer <token>
```

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage
npm run test:coverage

# Database management
npm run db:setup    # Setup database and run migrations
npm run prisma:studio  # Open Prisma Studio
```

### Project Structure

```
.
├── src/
│   ├── config/         # Configuration files
│   ├── lib/           # Library files (Prisma client)
│   ├── middleware/    # Express middleware
│   ├── repositories/  # Data access layer
│   ├── routes/        # API routes
│   ├── utils/         # Utility functions
│   ├── validations/   # Request validation schemas
│   ├── app.js         # Express app setup
│   └── server.js      # Server entry point
├── tests/
│   ├── helpers.js     # Test helper functions
│   ├── setup.js       # Test setup
│   ├── auth.test.js   # Authentication tests
│   └── todos.test.js  # Todo endpoint tests
├── prisma/
│   └── schema.prisma  # Database schema
├── docker-compose.yml # Docker configuration
└── package.json       # Project dependencies
```

## Docker Commands

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# View logs
docker-compose logs -f

# Reset database (removes all data)
docker-compose down -v
docker-compose up -d
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 