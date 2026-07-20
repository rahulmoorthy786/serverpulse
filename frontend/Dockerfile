# Builder stage

FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci 

COPY . .

RUN npm run build 

# Runner stage

FROM node:24-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist  ./dist
COPY --from=builder /app/package*.json  ./
COPY --from=builder /app/vite.config.js ./vite.config.js

RUN npm ci 

EXPOSE 5173

CMD ["npm","run","preview","--","--host","0.0.0.0","--port","5173"]
