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

  // userId -> Set<socketId>
  private onlineUsers = new Map<number, Set<string>>();

  constructor(
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
  ) {}

  afterInit() {
    console.log('✅ WebSocket Server initialized');
  }

  // ===== CONNECT =====
  async handleConnection(client: Socket) {
    try {
      const rawUserId = client.handshake.auth?.userId;
      const userId = Number(rawUserId);

      console.log('🔥 RAW USER ID:', rawUserId);

      if (!userId) {
        console.log('❌ Invalid userId → disconnect');
        client.disconnect();
        return;
      }

      client.data.userId = userId;

      // ✅ JOIN ROOM
      const room = `user-${userId}`;
      client.join(room);

      console.log(`✅ JOIN ROOM: ${room}`);

      // add socket
      const sockets = this.onlineUsers.get(userId) || new Set();
      sockets.add(client.id);
      this.onlineUsers.set(userId, sockets);

      // first tab online
      if (sockets.size === 1) {
        await this.usersService.markUserOnline(userId);
        this.server.emit('userOnline', userId);
      }

      console.log(`🟢 User ${userId} connected (${client.id})`);
    } catch (err) {
      console.log('❌ Connection error:', err);
      client.disconnect();
    }
  }

  // ===== DISCONNECT =====
  async handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (!userId) return;

    const sockets = this.onlineUsers.get(userId);

    if (sockets) {
      sockets.delete(client.id);

      if (sockets.size === 0) {
        this.onlineUsers.delete(userId);

        await this.usersService.markUserOffline(userId);
        this.server.emit('userOffline', userId);

        console.log(`🔴 User ${userId} offline`);
      } else {
        this.onlineUsers.set(userId, sockets);
      }
    }

    console.log(`❌ Client disconnected: ${client.id}`);
  }

  // ===== SEND MESSAGE =====
@SubscribeMessage('sendMessage')
async handleMessage(
  @ConnectedSocket() client: Socket,
  @MessageBody() payload: any,
) {
  const dto = plainToInstance(CreateMessageDto, payload);
  const errors = await validate(dto);

  if (errors.length > 0) {
    throw new WsException('Validation failed');
  }

  const savedMessage = await this.messagesService.create(dto);

  const receiverRoom = `user-${savedMessage.receiver.id}`;

  // ✅ CHỈ EMIT CHO RECEIVER
  this.server.to(receiverRoom).emit('new_message', savedMessage);

  return savedMessage;
}

  // ===== TYPING =====
  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { toUserId: number },
  ) {
    const from = client.data.userId;
    const room = `user-${data.toUserId}`;

    console.log(`⌨️ typing: ${from} -> ${data.toUserId}`);

    this.server.to(room).emit('typing', { from });
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { toUserId: number },
  ) {
    const from = client.data.userId;
    const room = `user-${data.toUserId}`;

    this.server.to(room).emit('stopTyping', { from });
  }

  // ===== SEEN =====
  @SubscribeMessage('seenMessage')
  handleSeen(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: number; toUserId: number },
  ) {
    const from = client.data.userId;
    const room = `user-${data.toUserId}`;

    console.log(`👁️ seen: ${from} -> ${data.toUserId}`);

    this.server.to(room).emit('messageSeen', {
      messageId: data.messageId,
      seenBy: from,
    });
  }

  // ===== ONLINE USERS =====
  @SubscribeMessage('getOnlineUsers')
  handleGetOnlineUsers(@ConnectedSocket() client: Socket) {
    const onlineUserIds = Array.from(this.onlineUsers.keys());

    console.log('📡 SEND onlineUsers:', onlineUserIds);

    client.emit('onlineUsers', onlineUserIds);
  }
}