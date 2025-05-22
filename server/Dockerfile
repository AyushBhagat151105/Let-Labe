FROM node:18-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate
RUN pnpm prune --prod

FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 8080

CMD ["sh", "-c", "pnpm prisma migrate deploy && node src/app.js"]