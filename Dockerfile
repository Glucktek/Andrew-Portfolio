# Multi-stage build file. The final image will be nginx serving static files.
# Backend API is built and run from a separate service/container (see docker-compose).

# ---------- Frontend build stage ----------
FROM oven/bun:1.2 AS frontend-builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .
# Ensure production build
ENV NODE_ENV=production
RUN bun run build

# ---------- Frontend runtime (nginx) ----------
FROM nginx:alpine AS frontend
COPY --from=frontend-builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
