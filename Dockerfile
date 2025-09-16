# syntax=docker/dockerfile:1.7
# Multi-stage build for Astro site

# 1) Builder: install deps and build static site
FROM node:22-alpine AS builder
WORKDIR /app

# Install system deps for sharp (used by astro:assets)
RUN apk add --no-cache libc6-compat \
  vips vips-dev

# Copy package manifests first for better caching
COPY package.json bun.lock* ./

# Install bun for fast install
RUN npm i -g bun@latest

# Install dependencies (frozen lockfile)
RUN bun install --frozen-lockfile

# Copy the rest of the project
COPY . .

# Build the site (outputs to dist/ with current adapter config)
# If using @astrojs/node adapter, switch to static export when building container.
# We temporarily override adapter by setting ASTRO_ADA jkPTER to static at build time.
ENV NODE_ENV=production
RUN npx astro build

# 2) Runtime: nginx to serve static files, plus a lightweight internal API proxy path
FROM nginx:1.27-alpine AS runtime

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built site to nginx html root
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for Traefik to route to
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
