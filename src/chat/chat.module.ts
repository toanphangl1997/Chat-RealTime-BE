import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { MessagesModule } from '../messages/messages.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [MessagesModule, UsersModule], // Để ChatGateway dùng được MessagesService
  providers: [ChatGateway],
})
export class ChatModule {}
