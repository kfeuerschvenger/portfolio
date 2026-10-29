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

# Fails the start-up with a clear message when TRUSTED_PROXY_CIDR is empty. The numeric prefix
# runs it before 20-envsubst-on-templates.sh renders the template.
COPY docker/18-check-trusted-proxy.sh /docker-entrypoint.d/18-check-trusted-proxy.sh
RUN chmod +x /docker-entrypoint.d/18-check-trusted-proxy.sh

# Network the reverse proxy connects from, trusted for X-Forwarded-For. Override at run time.
# The default covers the whole Docker bridge range (172.16.0.0/12) so the image works out of the
# box, but any container on any bridge network could then spoof client addresses. Narrow it to the
# subnet of the proxy network (docker network inspect <network>) in every real deployment.
ENV TRUSTED_PROXY_CIDR=172.16.0.0/12
ENV NGINX_ENVSUBST_FILTER=TRUSTED_PROXY_CIDR

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
