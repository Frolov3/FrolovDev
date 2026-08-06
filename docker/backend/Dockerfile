FROM node:22-bookworm-slim AS base

RUN apt-get update \
	&& apt-get install -y --no-install-recommends ca-certificates openssl \
	&& rm -rf /var/lib/apt/lists/*

FROM base AS deps

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci

FROM base AS dev

WORKDIR /app
ENV NODE_ENV=development

COPY backend/package*.json ./
RUN npm ci

EXPOSE 3000

CMD ["sh", "-c", "npx prisma generate && npm run dev"]

FROM base AS builder

WORKDIR /app
ENV DATABASE_URL=mysql://user:password@localhost:3306/app

COPY --from=deps /app/node_modules ./node_modules
COPY backend/ ./

RUN DATABASE_URL=mysql://user:password@localhost:3306/app npx prisma generate
RUN npm run build

FROM base AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

RUN npm prune --omit=dev
RUN mkdir -p logs uploads

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
