# Backend (NestJS + Prisma + Stripe)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm i

FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run prisma:gen
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY prisma ./prisma
EXPOSE 3001
CMD sh -c "npx prisma migrate deploy && node dist/main.js"
