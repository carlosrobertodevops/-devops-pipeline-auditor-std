# src/Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm i

FROM deps AS build
WORKDIR /app
COPY . .

# 1) Confere se o CSS está no local correto (src/styles/globals.css dentro do contexto src/)
RUN test -f ./styles/globals.css \
  && echo "✅ styles/globals.css encontrado" \
  || (echo "❌ Faltando styles/globals.css no contexto src/." && ls -la && exit 1)

# 2) Falha cedo se o import do layout estiver errado (deve ser: import '../styles/globals.css')
RUN grep -q "import '../styles/globals.css'" ./app/layout.tsx \
  && echo "✅ Import correto em app/layout.tsx" \
  || (echo "❌ Import incorreto em app/layout.tsx. Use: import '../styles/globals.css'" && sed -n '1,60p' app/layout.tsx && exit 1)

# 3) Garante que exista um diretório public/ (mesmo vazio) para o COPY do estágio runner
RUN mkdir -p ./public

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Somente o necessário para rodar
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
