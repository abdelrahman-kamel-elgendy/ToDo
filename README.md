# Todo Application

A modern Todo List application built with NestJS, TypeScript, and Prisma. This application provides a robust API for managing todos with features like authentication, pagination, and real-time updates.

## Features

- 🔐 JWT Authentication
- 📝 CRUD operations for todos
- 📊 Pagination and filtering
- 🔍 Search functionality
- 📱 RESTful API
- 📚 Swagger API documentation
- 🧪 Unit tests
- 🔒 Password hashing and security
- 🎯 Role-based access control

## Tech Stack

- **Backend Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT, Passport
- **API Documentation:** Swagger
- **Testing:** Jest
- **Validation:** Zod
- **Security:** Helmet, CORS

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd todo-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/todo_db"
   JWT_SECRET="your-secret-key"
   JWT_EXPIRES_IN="1d"
   PORT=3000
   NODE_ENV=development
   ```

4. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```

5. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:
```
http://localhost:3000/api
```

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/change-password` - Change user password

### Todo Endpoints

- `GET /api/todos` - List all todos (with pagination)
- `POST /api/todos` - Create a new todo
- `GET /api/todos/:id` - Get a specific todo
- `PATCH /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo
- `PATCH /api/todos/:id/toggle` - Toggle todo completion status

## Testing

Run unit tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:cov
```

Run e2e tests:
```bash
npm run test:e2e
```

## Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   └── guards/          # Authentication guards
├── todo/                # Todo module
│   ├── todo.controller.ts
│   ├── todo.service.ts
│   └── todo.module.ts
├── prisma/              # Database configuration
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── middleware/          # Custom middleware
├── utils/              # Utility functions
└── main.ts            # Application entry point
```

## API Request/Response Examples

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "John Doe"
}
```

### Create Todo
```http
POST /api/todos
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Complete project",
  "description": "Finish the todo application",
  "priority": "HIGH",
  "dueDate": "2024-03-20T00:00:00Z"
}
```

### List Todos
```http
GET /api/todos?page=1&limit=10&completed=false
Authorization: Bearer <token>
```

## Error Handling

The API uses standard HTTP status codes and returns error responses in the following format:

```json
{
  "status": "error",
  "message": "Error message",
  "errors": [] // Optional validation errors
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email <your-email> or open an issue in the repository. 