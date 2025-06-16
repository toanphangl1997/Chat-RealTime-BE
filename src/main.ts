import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); //  ép kiểu Express

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: '*', //  nếu muốn cho phép tất cả
    credentials: true, // nếu có gửi cookie
  });

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Cho phép serve file tĩnh (HTML test)
  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(process.env.PORT ?? 3197);
}
bootstrap();
