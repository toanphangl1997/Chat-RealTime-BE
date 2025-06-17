import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { Message } from './entities/message.entity';
import { User } from './entities/user.entity';
import { MessagesModule } from './messages/messages.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load biến môi trường toàn cục
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProduction = config.get('NODE_ENV') === 'production';
        return {
          type: 'postgres',
          url: config.get('DATABASE_URL'),
          ssl: isProduction ? { rejectUnauthorized: false } : false,
          autoLoadEntities: true,
          synchronize: true, // nên set false nếu production thực tế
        };
      },
    }),

    TypeOrmModule.forFeature([User, Message]),
    UsersModule,
    MessagesModule,
    ChatModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
