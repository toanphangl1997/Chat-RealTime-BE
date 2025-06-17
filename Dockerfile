# Stage 1: Build
FROM node:20 AS builder

# Cài đặt biến môi trường
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /app

# Copy package trước để cache tốt hơn
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Cài Nest CLI local (nằm trong node_modules/.bin/nest)
RUN npm install --save-dev @nestjs/cli

# Chạy build chỉ khi production
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi


# Stage 2: Run app
FROM node:20

WORKDIR /app

# Copy node_modules và mã đã build từ stage builder
COPY --from=builder /app /app

# Cổng mặc định expose
EXPOSE 3197

# CMD cho cả dev và prod
CMD if [ "$NODE_ENV" = "development" ]; then \
      npm install --legacy-peer-deps && \
      npx ts-node-dev --respawn src/main.ts; \
    else \
      node dist/main.js; \
    fi
