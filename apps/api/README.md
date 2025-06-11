# API Backend

This is the backend API service built with Express.js and TypeScript.

## Setup

1. Install dependencies:

```bash
yarn install
```

2. Create a `.env` file in the root of the `api` directory with the following variables:

```
PORT=8000
NODE_ENV=development
```

## Available Scripts

- `yarn dev` - Start development server with hot reload
- `yarn build` - Build the application
- `yarn start` - Start the production server
- `yarn lint` - Run ESLint
- `yarn test` - Run tests

## Project Structure

```
src/
  ├── index.ts        # Application entry point
  ├── app.ts          # Express app configuration
  ├── server.ts       # Server startup logic
  ├── config/         # Configuration management
  │   └── index.ts    # Environment variables and settings
  ├── routes/         # API routes
  │   ├── index.ts    # Main router
  │   └── auth.ts     # Authentication routes
  ├── controllers/    # Route controllers
  │   └── authController.ts    # Authentication logic
  ├── middleware/     # Custom middleware
  │   ├── errorHandler.ts      # Error handling
  │   └── logger.ts           # Request logging
  ├── services/       # Business logic
  │   └── userService.ts      # User management
  ├── models/         # Data models
  │   └── User.ts            # User model
  ├── utils/          # Utility functions
  │   └── database.ts        # Database connection
  ├── types/          # TypeScript type definitions
  │   └── index.ts           # Common interfaces
  └── constants/      # Application constants
      └── index.ts           # HTTP status codes, messages, message builder
```

## API Endpoints

- `GET /auth/login` - OAuth login redirect
- `GET /auth/callback` - OAuth callback handler

## Message System

The API uses a scalable message system with the following features:

### Message Structure

- **Type**: SUCCESS, ERROR, WARNING, INFO
- **Category**: AUTH, USER, DATABASE, VALIDATION, SYSTEM
- **Code**: Unique identifier (e.g., AUTH_001)
- **Template**: Message text with optional variables

### Usage Examples

```typescript
import { MessageBuilder } from "../constants";

// Simple message
const message = MessageBuilder.build("AUTH_SUCCESS");

// Message with variables
const error = MessageBuilder.build("ROUTE_NOT_FOUND", { route: "/api/users" });

// Message with error code
const codeMessage = MessageBuilder.getMessageWithCode("DATABASE_ERROR");
```

### Benefits

- **Scalable**: Easy to add new messages without restructuring
- **Type Safe**: Full TypeScript support with autocomplete
- **Flexible**: Support for dynamic content via template variables
- **Organized**: Messages grouped by category and type
- **Traceable**: Each message has a unique code for logging/debugging
