# ================= DEPS =================
FROM node:20-alpine AS deps
WORKDIR /app

# Copia manifestos para cache eficiente
COPY package.json package-lock.json* ./

# Instala dependências + devDependencies (necessário p/ Tailwind no build)
RUN npm ci --no-audit --no-fund || npm i --no-audit --no-fund

# ================= BUILD =================
FROM node:20-alpine AS build
WORKDIR /app

# node_modules da stage de deps
COPY --from=deps /app/node_modules ./node_modules

# código da aplicação (o contexto deste Dockerfile deve ser src/)
COPY . .

# sanity checks
RUN test -f ./styles/globals.css || (echo '❌ Faltando styles/globals.css (src/styles/globals.css).'; exit 1)

# garanta que a pasta public exista no build, mesmo que vazia
RUN mkdir -p public

# build de produção
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ================= RUNTIME =================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# artefatos necessários
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=deps  /app/node_modules ./node_modules

# enxuga devDependencies (se houver)
RUN npm prune --omit=dev || true

EXPOSE 3000
CMD ["npm", "run", "start"]