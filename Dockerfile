# =============================================================================
# DarulQuran Foundation — Backend Dockerfile
# Multi-stage build: compile TypeScript → run production JS
# =============================================================================

# ---- Stage 1: Build ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install all dependencies (including devDependencies for tsc)
COPY package*.json ./
RUN npm ci

# Copy source and compile
COPY . .
RUN npm run build
RUN npm run seed:prod

# ---- Stage 2: Production ----
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install production-only dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled output and tsconfig-paths registration file
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 5002

CMD ["node", "-r", "tsconfig-paths/register", "dist/server.js"]
