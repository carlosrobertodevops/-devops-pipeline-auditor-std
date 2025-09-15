# api/Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN apk add --no-cache libc6-compat openssl
RUN npm ci --no-audit --no-fund || npm i --no-audit --no-fund

FROM deps AS build
WORKDIR /app
COPY . .
RUN npx prisma generate --schema ./prisma/schema.prisma
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# deps de runtime
COPY --from=deps /app/node_modules ./node_modules
# artefatos
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY package.json ./

# API (3001) + métricas Prometheus (9464)
EXPOSE 3001 9464
CMD ["node", "dist/main.js"]
