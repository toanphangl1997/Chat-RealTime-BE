FROM node:20

# Gắn biến môi trường
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

WORKDIR /app

# Cài đúng gói cần thiết trước khi copy source để tối ưu cache layer
COPY package*.json ./

# Cài đặt toàn bộ khi dev, chỉ cài gói production nếu build cho production
RUN if [ "$NODE_ENV" = "production" ]; then npm install --omit=dev; else npm install; fi

# Copy toàn bộ mã nguồn (bao gồm tsconfig.json, src, ...)
COPY . .

# Expose cổng NestJS
EXPOSE 3197

# Build nếu là production
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

# Chạy tùy theo môi trường
CMD [ "sh", "-c", "if [ \"$NODE_ENV\" = 'development' ]; then npx ts-node-dev --respawn src/main.ts; else node dist/main.js; fi" ]
