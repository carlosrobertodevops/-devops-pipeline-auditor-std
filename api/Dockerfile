# Backend (NestJS + Prisma + Stripe)
FROM node:20-alpine AS deps
WORKDIR /app

# Dependências úteis para Prisma no Alpine
RUN apk add --no-cache libc6-compat openssl

# Instala deps com cache
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund || npm i --no-audit --no-fund

# ===== Build =====
FROM deps AS build
WORKDIR /app

# Copia TODO o código da API (inclui prisma/, src/, tsconfig, etc)
COPY . .

# Debug: liste o diretório prisma e confirme o schema
RUN echo "Conteúdo de /app/prisma:" && ls -la prisma || true
RUN test -f ./prisma/schema.prisma && echo "✅ prisma/schema.prisma encontrado" || (echo "❌ prisma/schema.prisma NÃO encontrado. Verifique se a pasta 'prisma/' está no contexto de build." && exit 1)

# Gera client Prisma usando caminho explícito do schema
RUN npx prisma generate --schema ./prisma/schema.prisma

# Compila a API (NestJS)
RUN npm run build

# ===== Runtime =====
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copia node_modules e artefatos de build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 3001
CMD sh -c "npx prisma migrate deploy && node dist/main.js"
