FROM node:20-slim AS base

# Install OpenSSL (required by Prisma)
RUN apt-get update && apt-get install -y openssl wget && rm -rf /var/lib/apt/lists/*

# Install pnpm (v8 for lockfile v6.0 compatibility)
RUN corepack enable && corepack prepare pnpm@8 --activate

# --- Build stage ---
FROM base AS builder
WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm generate

ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:/tmp/build.db"
RUN npx prisma migrate deploy && pnpm build

# --- Production stage ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy only what's needed for production
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.ts ./

# Create data and upload directories
RUN mkdir -p /app/data /app/data/uploads/menu

EXPOSE 3000

# Run migrations and start app
CMD /bin/sh -c "npx prisma migrate deploy && exec pnpm start"
