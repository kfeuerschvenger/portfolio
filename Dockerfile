FROM node:22-alpine AS builder

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

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx.conf is a template: the image entrypoint substitutes TRUSTED_PROXY_CIDR (and nothing else)
# and writes /etc/nginx/conf.d/default.conf when the container starts.
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY security-headers.conf /etc/nginx/snippets/security-headers.conf

# Network the reverse proxy connects from, trusted for X-Forwarded-For. Override at run time.
ENV TRUSTED_PROXY_CIDR=172.16.0.0/12
ENV NGINX_ENVSUBST_FILTER=TRUSTED_PROXY_CIDR

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
