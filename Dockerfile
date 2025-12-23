FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies (including devDependencies needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Install additional nginx modules for better performance
RUN apk add --no-cache brotli

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ensure nginx can write to required directories
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run && \
    chmod 755 /var/cache/nginx /var/log/nginx /var/run

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]