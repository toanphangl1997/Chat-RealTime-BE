FROM node:20 AS builder

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Dùng npx thay vì gọi trực tiếp nest.js để tránh lỗi module
RUN if [ "$NODE_ENV" = "production" ]; then npx nest build; fi

FROM node:20

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 3197

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = 'development' ]; then npm install && npx ts-node-dev --respawn src/main.ts; else node dist/main.js; fi"]
