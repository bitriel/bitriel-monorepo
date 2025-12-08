# Web Dockerfile
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
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY packages/http-client ./packages/http-client
COPY apps/web ./apps/web

# Build the web app
WORKDIR /app/apps/web
RUN pnpm build

# Production stage with nginx
FROM nginx:alpine AS production

# Copy built files to nginx
COPY --from=base /app/apps/web/dist /usr/share/nginx/html

# Copy nginx configuration (optional, uses default if not provided)
# COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

