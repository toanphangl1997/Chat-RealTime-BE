# Stage 1: Build
FROM node:20 AS builder

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Chạy build nếu production (dùng Nest CLI local theo script đã sửa)
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi


# Stage 2: Chạy app
FROM node:20

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 3197

CMD if [ "$NODE_ENV" = "development" ]; then \
      npm install && \
      npx ts-node-dev --respawn src/main.ts; \
    else \
      node dist/main.js; \
    fi
