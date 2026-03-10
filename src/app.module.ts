import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ep-wandering-snow-a1t4hy9t.ap-southeast-1.aws.neon.tech',
      port: 5432,
      username: 'neondb_owner',
      password: 'npg_hVQ3Kj1SnmTL',
      database: 'neondb',

      ssl: {
        rejectUnauthorized: false,
      },

      extra: {
        ssl: true,
      },

      autoLoadEntities: true,
      synchronize: false, // production nên false
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