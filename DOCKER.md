# Docker Setup Guide

This guide explains how to run the Bitriel project using Docker and Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)

## Quick Start

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd bitriel
   ```

2. **Create environment file**:
   ```bash
   cp env.example .env
   ```

3. **Edit `.env` file** with your configuration:
   - Set `JWT_SECRET` to a secure random string
   - Add your `KOOMPI_CLIENT_ID` and `KOOMPI_CLIENT_SECRET`
   - Adjust other settings as needed

4. **Build and start all services**:
   ```bash
   docker-compose up -d
   ```

5. **View logs**:
   ```bash
   docker-compose logs -f
   ```

6. **Stop all services**:
   ```bash
   docker-compose down
   ```

## Services

The Docker Compose setup includes three services:

### 1. MongoDB
- **Port**: `27017`
- **Database**: `bitriel`
- **Data persistence**: Data is stored in a Docker volume (`mongodb_data`)

### 2. Backend API
- **Port**: `4000`
- **URL**: http://localhost:4000
- **Health check**: http://localhost:4000/health
- **Dependencies**: MongoDB

### 3. Web Frontend
- **Port**: `5173` (mapped to nginx port 80)
- **URL**: http://localhost:5173
- **Dependencies**: Backend API

## Common Commands

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### Stop and remove volumes (⚠️ deletes database data)
```bash
docker-compose down -v
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f web
docker-compose logs -f mongodb
```

### Rebuild services
```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build backend
docker-compose build web

# Rebuild and restart
docker-compose up -d --build
```

### Execute commands in containers
```bash
# Backend container
docker-compose exec backend sh

# MongoDB container
docker-compose exec mongodb mongosh bitriel
```

### Check service status
```bash
docker-compose ps
```

## Development Workflow

### Option 1: Full Docker (Recommended for production-like testing)
```bash
# Start all services
docker-compose up -d

# Make code changes, then rebuild
docker-compose build backend
docker-compose up -d backend
```

### Option 2: Hybrid (Backend in Docker, Web locally)
```bash
# Start MongoDB and Backend in Docker
docker-compose up -d mongodb backend

# Run web locally
cd apps/web
pnpm dev
```

### Option 3: Local Development
For local development without Docker:
```bash
# Start MongoDB in Docker only
docker-compose up -d mongodb

# Run backend and web locally
pnpm dev
```

## Environment Variables

All environment variables are defined in `.env` file. Key variables:

- `JWT_SECRET`: Secret key for JWT token signing (required)
- `KOOMPI_CLIENT_ID`: Koompi OAuth client ID (required)
- `KOOMPI_CLIENT_SECRET`: Koompi OAuth client secret (required)
- `MONGODB_URI`: MongoDB connection string (defaults to Docker service)
- `FRONTEND_URL`: Frontend application URL
- `PORT`: Backend server port (default: 4000)

## Troubleshooting

### Port already in use
If ports 4000, 5173, or 27017 are already in use:
1. Stop the conflicting service
2. Or modify ports in `docker-compose.yml`:
   ```yaml
   ports:
     - "4001:4000"  # Change host port
   ```

### MongoDB connection issues
- Ensure MongoDB container is healthy: `docker-compose ps`
- Check MongoDB logs: `docker-compose logs mongodb`
- Verify `MONGODB_URI` in `.env` uses `mongodb://mongodb:27017/bitriel` (not `localhost`)

### Backend build failures
- Clear Docker cache: `docker-compose build --no-cache backend`
- Check Node.js version compatibility
- Verify all workspace dependencies are properly configured

### Web app not loading
- Check if backend is running: `docker-compose ps`
- Verify backend URL in web app configuration
- Check browser console for CORS errors

## Production Deployment

For production deployment:

1. **Update environment variables**:
   - Use strong, unique `JWT_SECRET`
   - Set `NODE_ENV=production`
   - Update `FRONTEND_URL` and `KOOMPI_REDIRECT_URI` to production URLs

2. **Use production builds**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

3. **Set up reverse proxy** (nginx/traefik) for SSL/TLS

4. **Configure MongoDB authentication**:
   - Add MongoDB auth in `docker-compose.yml`
   - Update `MONGODB_URI` with credentials

5. **Set up backups** for MongoDB volume

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)

