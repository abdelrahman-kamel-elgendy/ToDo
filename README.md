# Todo List API

A RESTful API for a Todo List application built with Node.js, Express, Prisma, and PostgreSQL.

## Features

- 🔐 User authentication (register, login, logout)
- ✅ Create, read, update, and delete todos
- 🎯 Priority levels for todos
- 📅 Due date support
- 📊 Pagination and filtering
- 🛡️ Input validation with Zod
- 🐳 Docker support for database
- 🧪 Comprehensive test suite

## Tech Stack

- Node.js & Express
- Prisma ORM
- PostgreSQL
- Zod for validation
- JWT for authentication
- Jest & Supertest for testing

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

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

3. Set up environment variables:
   ```bash
   # In the root directory
   cp .env.example .env
   ```
   Update the `.env` file with your database credentials and JWT secret.

4. Start the PostgreSQL database using Docker:
   ```bash
   # Start the database container
   docker-compose up -d
   ```

5. Set up the database:
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at http://localhost:5000

## Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

## Docker Commands

### Database Management
```bash
# Start the database
docker-compose up -d

# Stop the database
docker-compose down

# View database logs
docker-compose logs -f postgres

# Reset database (removes all data)
docker-compose down -v
docker-compose up -d
```

### Database Connection
The PostgreSQL database is accessible at:
- Host: localhost
- Port: 5432
- Database: todo_app
- Username: postgres
- Password: postgres

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Todos
- `POST /api/todos` - Create a new todo
- `GET /api/todos` - Get all todos (with pagination and filtering)
- `GET /api/todos/:id` - Get a specific todo
- `PATCH /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Project Structure

```
.
├── src/
│   ├── config/         # Configuration files
│   ├── lib/           # Library files
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
├── .env.example       # Example environment variables
├── docker-compose.yml # Docker configuration
└── package.json       # Project dependencies
```

## Development

### Backend Development
- Run `npm run dev` to start the development server
- The server will automatically restart on file changes

### Database Management
- Use Prisma Studio to manage the database:
  ```bash
  npx prisma studio
  ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 