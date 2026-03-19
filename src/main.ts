// import cloudinary init
import { initCloudinary } from './config/cloudinary.config';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // INIT CLOUDINARY (QUAN TRỌNG NHẤT)
  initCloudinary();

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // CORS
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // Giữ lại nếu bạn vẫn cần file local (optional)
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // Static assets
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Realtime Chat API')
    .setDescription('API documentation for chat_app')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start server
  await app.listen(process.env.PORT ?? 3197);
}

bootstrap();