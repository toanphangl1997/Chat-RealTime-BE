# Dockerfile
FROM node:20

# Gắn biến môi trường để phân biệt DEV/PROD (sẽ nhận từ docker-compose)
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Cổng mặc định expose
EXPOSE 3197

# Production build
RUN npm install -g @nestjs/cli
RUN npm run build

# Nếu là development thì dùng ts-node-dev
CMD [ "sh", "-c", "if [ \"$NODE_ENV\" = 'development' ]; then npx ts-node-dev --respawn src/main.ts; else node dist/main.js; fi" ]
