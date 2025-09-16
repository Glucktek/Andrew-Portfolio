# syntax=docker/dockerfile:1.7
# Single-container Bun image running Astro SSR (site + /api)

FROM oven/bun:1.1-alpine AS base
WORKDIR /app

# System deps helpful for astro:assets
RUN apk add --no-cache libc6-compat vips vips-dev

# Copy lock + manifest first for better caching
COPY bun.lock package.json ./

# Install dependencies reproducibly
RUN bun install --ci

# Copy source
COPY . .

# Build the site with your configured adapter (SSR)
ENV NODE_ENV=production
RUN bun run build

# Expose SSR port (must match Compose/Traefik)
EXPOSE 4321

# Start Astro server (bind to all interfaces for Docker)
CMD ["bun", "run", "start", "--", "--host", "0.0.0.0", "--port", "4321"]
