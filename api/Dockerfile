# ========= DEPS =========
FROM node:20-alpine AS deps
WORKDIR /app

# Copia manifestos para instalar deps (isso habilita cache por arquivo)
COPY package.json package-lock.json* ./

# OpenSSL para Prisma binários
RUN apk add --no-cache libc6-compat openssl

# Instala dependências (com fallback para peer deps)
# Se o lock não existir, o segundo comando cobre
RUN npm ci --no-audit --no-fund || npm i --no-audit --no-fund --legacy-peer-deps

# ========= BUILD =========
FROM node:20-alpine AS build
WORKDIR /app

# Copia node_modules do estágio anterior
COPY --from=deps /app/node_modules ./node_modules

# Copia o restante do código
COPY . .

# Garante que o schema existe e gera o client
RUN test -f ./prisma/schema.prisma || (echo "❌ prisma/schema.prisma não encontrado" && exit 1)
RUN npx prisma generate --schema ./prisma/schema.prisma

# Compila NestJS
RUN npm run build

# ========= RUNTIME =========
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copia apenas o necessário para executar
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./package.json
COPY --from=deps  /app/node_modules ./node_modules

# Exposição (API) + Prometheus (OTel) configurado pelo app em 9464
EXPOSE 3001 9464

CMD ["node", "dist/main.js"]


# # api/Dockerfile
# FROM node:20-alpine AS deps
# WORKDIR /app
# COPY package.json package-lock.json* ./

# # libs necessárias (openssl p/ prisma CLI)
# RUN apk add --no-cache libc6-compat openssl

# # 1) tenta ci com lock; 2) fallback p/ legacy peer deps (evita ERESOLVE)
# RUN npm ci --no-audit --no-fund || npm i --no-audit --no-fund --legacy-peer-deps

# # ===========================
# FROM deps AS build
# WORKDIR /app
# COPY . .

# # Gera o client Prisma (usa schema em ./prisma/schema.prisma)
# RUN npx prisma generate --schema ./prisma/schema.prisma

# # Compila NestJS
# RUN npm run build

# # ===========================
# FROM node:20-alpine AS runner
# WORKDIR /app
# ENV NODE_ENV=production

# # Copia dependências **do stage build** (já contém o Prisma Client gerado)
# COPY --from=build /app/node_modules ./node_modules

# # Artefatos de build + schema
# COPY --from=build /app/dist    ./dist
# COPY --from=build /app/prisma  ./prisma
# COPY package.json ./

# # Exponha as portas: API (3001) + métricas Prometheus Exporter (9464)
# EXPOSE 3001 9464

# CMD ["node", "dist/main.js"]
