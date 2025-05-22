FROM node:18-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate


FROM node:18-alpine AS production

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/node_modules/.pnpm ./node_modules/.pnpm


COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma


EXPOSE 8080


CMD ["sh", "-c", "pnpm prisma migrate deploy && exec node src/app.js"]