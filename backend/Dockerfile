FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev


FROM gcr.io/distroless/nodejs24-debian13:nonroot

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY src ./src
COPY sql ./sql

EXPOSE 5000

CMD ["src/server.js"]
