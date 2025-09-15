# # Frontend (Next.js 15 + Tailwind)
# FROM node:20-alpine AS deps
# WORKDIR /app
# COPY package.json package-lock.json* ./
# RUN npm ci || npm i

# FROM deps AS build
# WORKDIR /app
# COPY . .
# ENV NEXT_TELEMETRY_DISABLED=1
# RUN npm run build

# FROM node:20-alpine AS runner
# WORKDIR /app
# ENV NODE_ENV=production
# ENV PORT=3000
# COPY --from=deps /app/node_modules ./node_modules
# COPY --from=build /app/.next ./.next
# COPY --from=build /app/package.json ./package.json
# COPY --from=build /app/next.config.mjs ./next.config.mjs
# COPY --from=build /app/public ./public
# COPY --from=build /app/app ./app
# COPY --from=build /app/lib ./lib
# COPY --from=build /app/styles ./styles
# COPY --from=build /app/tailwind.config.ts ./tailwind.config.ts
# COPY --from=build /app/postcss.config.js ./postcss.config.js
# EXPOSE 3000
# CMD ["npm","start","-p","3000"]


# Frontend (Next.js + Tailwind)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm i

FROM deps AS build
WORKDIR /app
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Instala apenas deps de runtime
COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev || npm i --omit=dev

# Copia saída standalone do Next
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
