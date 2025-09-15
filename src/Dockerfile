# Frontend (Next.js + Tailwind)
# Contexto esperado no docker-compose: ./src

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm i

FROM deps AS build
WORKDIR /app

# Copia TUDO do src/ (respeitando .dockerignore) para não falhar se
# algumas pastas não existirem (ex.: components/ ou public/).
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Instala apenas dependências de runtime
COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev || npm i --omit=dev

# Copia a saída standalone do Next
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
