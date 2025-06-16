import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from '../messages/dto/create-message.dto';
import { MessagesService } from '../messages/messages.service';
import { UsersService } from '../users/users.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private onlineUsers = new Map<string, number>(); // socket.id => user_id

  constructor(
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket Server initialized');
  }

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // client just connected, wait until userId is received via userOnline
  }

  async handleDisconnect(client: Socket) {
    const userId = this.onlineUsers.get(client.id);
    if (userId) {
      await this.usersService.markUserOffline(userId);
      this.onlineUsers.delete(client.id);
      console.log(`User ${userId} marked as offline`);
      await this.broadcastOnlineUsers();
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('userOnline')
  async handleUserOnline(
    @MessageBody() userId: number,
    @ConnectedSocket() client: Socket,
  ) {
    if (!userId || typeof userId !== 'number') {
      console.warn(`⚠️ Invalid userId from ${client.id}:`, userId);
      return;
    }

    this.onlineUsers.set(client.id, userId);
    await this.usersService.markUserOnline(userId);
    console.log(`User ${userId} marked as online`);

    await this.broadcastOnlineUsers();
  }

  private async broadcastOnlineUsers() {
    const userIds = Array.from(this.onlineUsers.values());
    const uniqueIds = [...new Set(userIds)]; // tránh trùng nếu nhiều tab cùng 1 user
    const userInfos = await Promise.all(
      uniqueIds.map((id) => this.usersService.findOne(id)),
    );
    this.server.emit('onlineUsers', userInfos);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() payload: any) {
    console.log('Incoming payload:', payload);

    const dto = plainToInstance(CreateMessageDto, payload);
    const errors = await validate(dto);
    if (errors.length > 0) {
      const messages = errors
        .map((err) => Object.values(err.constraints || {}))
        .flat();
      throw new WsException(`Validation failed: ${messages.join(', ')}`);
    }

    try {
      const savedMessage = await this.messagesService.create(dto);
      console.log('Message saved:', savedMessage);

      this.server.emit('newMessage', savedMessage);
      return savedMessage;
    } catch (error) {
      console.error('Error saving message:', error);
      throw new WsException(error.message || 'Failed to save message');
    }
  }

  @SubscribeMessage('typing')
  handleTyping(@MessageBody() data: { toUserId: number; fromUser: any }) {
    console.log('Emit typing to user:', data.toUserId, 'from:', data.fromUser);
    this.server.to(`user-${data.toUserId}`).emit('typing', data.fromUser);
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(@MessageBody() data: { toUserId: number; fromUser: any }) {
    this.server.to(`user-${data.toUserId}`).emit('stopTyping', data.fromUser);
  }
}
