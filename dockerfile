# ---- Base Stage ----
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Use tini as init process to handle signals properly
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

# ---- Dependencies Stage ----
FROM base AS deps

# Install dependencies based on lock file
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Detect which package manager is used
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; fi

# ---- Build Stage ----
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js app
RUN npm run build

# ---- Production Stage ----
FROM base AS runner

ENV NODE_ENV=production
ENV PORT=3000

# Create a non-root user
RUN addgroup --system app && adduser --system --ingroup app app
USER app

WORKDIR /app

# Copy only necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3000

CMD ["npm", "start"]