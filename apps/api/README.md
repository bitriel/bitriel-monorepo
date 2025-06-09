# API Backend

This is the backend API service built with Express.js and TypeScript.

## Setup

1. Install dependencies:

```bash
yarn install
```

2. Create a `.env` file in the root of the `api` directory with the following variables:

```
PORT=3000
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
  ├── routes/         # API routes
  ├── controllers/    # Route controllers
  ├── middleware/     # Custom middleware
  ├── services/       # Business logic
  ├── models/         # Data models
  └── utils/          # Utility functions
```

## API Endpoints

- `GET /health` - Health check endpoint
