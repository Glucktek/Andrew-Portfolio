# Stage 1: Build the Astro site with Bun 1.2
FROM oven/bun:1.2 AS builder

WORKDIR /app

# Install dependencies and copy code
COPY package.json bun.lock ./
RUN bun install

COPY . .

# Build the Astro site
RUN bun run build

# Stage 2: Serve the built site with a lightweight web server
FROM nginx:alpine

# Copy built static files to nginx public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
