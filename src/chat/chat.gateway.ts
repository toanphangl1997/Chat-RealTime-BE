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
  server!: Server;

  private onlineUsers = new Map<string, number>();

  constructor(
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
  ) {}

  afterInit() {
    console.log('WebSocket Server initialized');
  }

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    const userId = this.onlineUsers.get(client.id);

    if (userId) {
      await this.usersService.markUserOffline(userId);
      this.onlineUsers.delete(client.id);

      console.log(`User ${userId} offline`);
      await this.broadcastOnlineUsers();
    }

    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('userOnline')
  async handleUserOnline(
    @MessageBody() userId: number,
    @ConnectedSocket() client: Socket,
  ) {
    if (!userId) return;

    this.onlineUsers.set(client.id, userId);

    await this.usersService.markUserOnline(userId);

    // join room riêng của user
    client.join(`user-${userId}`);

    console.log(`User ${userId} online`);

    await this.broadcastOnlineUsers();
  }

  private async broadcastOnlineUsers() {
    const userIds = [...new Set(Array.from(this.onlineUsers.values()))];

    const userInfos = await Promise.all(
      userIds.map((id) => this.usersService.findOne(id)),
    );

    this.server.emit('onlineUsers', userInfos);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() payload: any) {
    const dto = plainToInstance(CreateMessageDto, payload);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const messages = errors
        .map((err) => Object.values(err.constraints || {}))
        .flat();

      throw new WsException(messages.join(', '));
    }

  try {
    const savedMessage = await this.messagesService.create(dto);

    const senderId = savedMessage.sender.id;
    const receiverId = savedMessage.receiver.id;

    this.server.to(`user-${senderId}`).emit('newMessage', savedMessage);
    this.server.to(`user-${receiverId}`).emit('newMessage', savedMessage);

    return savedMessage;
    } catch (error) {
        if (error instanceof Error) {
        throw new WsException(error.message);
  }

     throw new WsException('Save message failed');
}
  }

  @SubscribeMessage('typing')
  handleTyping(@MessageBody() data: { toUserId: number; fromUser: any }) {
    this.server.to(`user-${data.toUserId}`).emit('typing', data.fromUser);
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(@MessageBody() data: { toUserId: number; fromUser: any }) {
    this.server.to(`user-${data.toUserId}`).emit('stopTyping', data.fromUser);
  }
}