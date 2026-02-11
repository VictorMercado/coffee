FROM node:20-slim

WORKDIR /app

# Install OpenSSL (required by Prisma)
RUN apt-get update && apt-get install -y openssl wget && rm -rf /var/lib/apt/lists/*

# Install pnpm (v8 for lockfile v6.0 compatibility)
RUN corepack enable && corepack prepare pnpm@8 --activate

# Copy everything
COPY . .

# Install dependencies, generate Prisma client, build
RUN pnpm install --frozen-lockfile
RUN pnpm generate
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:/tmp/build.db"
RUN npx prisma migrate deploy && pnpm build

# Create data and upload directories
RUN mkdir -p /app/data /app/data/uploads/menu

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]
