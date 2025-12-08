# Backend Dockerfile
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.12.1 --activate

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./

# Copy package files
COPY packages/http-client/package.json ./packages/http-client/
COPY apps/backend/package.json ./apps/backend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY packages/http-client ./packages/http-client
COPY apps/backend ./apps/backend

# Build the backend
WORKDIR /app/apps/backend
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.12.1 --activate

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./

# Copy package files
COPY packages/http-client/package.json ./packages/http-client/
COPY apps/backend/package.json ./apps/backend/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy http-client package (uses TypeScript source directly)
COPY --from=base /app/packages/http-client ./packages/http-client
# Copy built backend files
COPY --from=base /app/apps/backend/dist ./apps/backend/dist
COPY --from=base /app/apps/backend/package.json ./apps/backend/

# Set working directory to backend
WORKDIR /app/apps/backend

# Expose port
EXPOSE 4000

# Start the server
CMD ["node", "dist/index.js"]

