# Stage 1: Build
FROM node:20 AS builder

WORKDIR /app

# Cài gói (bao gồm devDependencies)
COPY package*.json ./
ENV NODE_ENV=development
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Build ứng dụng NestJS
RUN npm run build

# Stage 2: Runtime
FROM node:20

WORKDIR /app

COPY --from=builder /app /app

# Chạy ứng dụng đã build
CMD ["node", "dist/main.js"]
