# Dastafzar API (NestJS + Prisma 6) — production image
FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps --no-audit --no-fund
COPY . .
RUN npx prisma generate && npm run build
EXPOSE 4000
# Migrations are applied on every start (idempotent), then the API boots.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
