# api/Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./

# libs necessárias (openssl p/ prisma CLI)
RUN apk add --no-cache libc6-compat openssl

# 1) tenta ci com lock; 2) fallback p/ legacy peer deps (evita ERESOLVE)
RUN npm ci --no-audit --no-fund || npm i --no-audit --no-fund --legacy-peer-deps

# ===========================
FROM deps AS build
WORKDIR /app
COPY . .

# Gera o client Prisma (usa schema em ./prisma/schema.prisma)
RUN npx prisma generate --schema ./prisma/schema.prisma

# Compila NestJS
RUN npm run build

# ===========================
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copia dependências **do stage build** (já contém o Prisma Client gerado)
COPY --from=build /app/node_modules ./node_modules

# Artefatos de build + schema (útil p/ prisma migrate em runtime se quiser)
COPY --from=build /app/dist    ./dist
COPY --from=build /app/prisma  ./prisma
COPY package.json ./

# Exponha as portas: API (3001) + métricas Prometheus Exporter (9464)
EXPOSE 3001 9464

CMD ["node", "dist/main.js"]


# # api/Dockerfile
# FROM node:20-alpine AS deps
# WORKDIR /app
# COPY package.json package-lock.json* ./

# # libs necessárias (openssl p/ prisma)
# RUN apk add --no-cache libc6-compat openssl

# # 1) tenta ci com lock; 2) se houver conflitos de peer deps, usa install com --legacy-peer-deps
# RUN /bin/sh -c npm ci --no-audit --no-fund || npm i --no-audit --no-fund --legacy-peer-deps

# FROM deps AS build
# WORKDIR /app
# COPY . .

# # Prisma client
# RUN npx prisma generate --schema ./prisma/schema.prisma

# # Build NestJS
# RUN npm run build

# FROM node:20-alpine AS runner
# WORKDIR /app
# ENV NODE_ENV=production

# # deps de runtime
# COPY --from=deps /app/node_modules ./node_modules

# # artefatos
# COPY --from=build /app/dist ./dist
# COPY --from=build /app/prisma ./prisma
# COPY package.json ./

# # portas: API (3001) + métricas Prometheus Exporter (9464)
# EXPOSE 3001 9464
# CMD ["node", "dist/main.js"]

# # # Backend (NestJS + Prisma + Stripe)
# # FROM node:20-alpine AS deps
# # WORKDIR /app

# # # Dependências úteis para Prisma/Node no Alpine
# # RUN apk add --no-cache libc6-compat openssl

# # # Instala dependências com cache
# # COPY package.json package-lock.json* ./
# # RUN npm ci --no-audit --no-fund || npm i --no-audit --no-fund

# # # ===== Build =====
# # FROM deps AS build
# # WORKDIR /app

# # # Copia TODO o código da API (inclui prisma/, src/, tsconfig, etc.)
# # COPY . .

# # # Debug: liste o diretório prisma e confirme o schema
# # RUN echo "Conteúdo de /app/prisma:" && ls -la prisma || true

# # # Checagens preventivas para falhar cedo com mensagem clara
# # RUN test -f ./prisma/schema.prisma && echo "✅ prisma/schema.prisma encontrado" || (echo "❌ prisma/schema.prisma NÃO encontrado." && exit 1)
# # RUN test -f ./webhooks/webhooks.module.ts && echo "✅ webhooks/webhooks.module.ts encontrado" || (echo "❌ webhooks/webhooks.module.ts NÃO encontrado." && exit 1)

# # # Gera client Prisma usando caminho explícito do schema
# # RUN npx prisma generate --schema ./prisma/schema.prisma

# # # Compila a API (NestJS)
# # RUN npm run build

# # # ===== Runtime =====
# # FROM node:20-alpine AS runner
# # WORKDIR /app
# # ENV NODE_ENV=production

# # # Copia node_modules e artefatos de build
# # COPY --from=deps  /app/node_modules ./node_modules
# # COPY --from=build /app/dist         ./dist
# # COPY --from=build /app/prisma       ./prisma

# # EXPOSE 3001
# # # Aplica migrations no start e sobe a API
# # CMD sh -c "npx prisma migrate deploy && node dist/main.js"
