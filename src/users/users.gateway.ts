import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } })
export class UsersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  // userId => Set of socketId
  private onlineMap: Map<number, Set<string>> = new Map();

  private getUserId(client: Socket): number | null {
    const auth = client.handshake.auth;
    if (!auth || !auth.userId) return null;
    return Number(auth.userId);
  }

  handleConnection(client: Socket) {
    const userId = this.getUserId(client);
    if (!userId) {
      client.disconnect();
      return;
    }

    const userSockets = this.onlineMap.get(userId) || new Set();
    userSockets.add(client.id);
    this.onlineMap.set(userId, userSockets);

    console.log(`User ${userId} connected (${client.id})`);

    // emit danh sách online và user online
    this.server.emit('onlineUsers', Array.from(this.onlineMap.keys()));
    this.server.emit('userOnline', userId);
  }

  handleDisconnect(client: Socket) {
    const userId = this.getUserId(client);
    if (!userId) return;

    const userSockets = this.onlineMap.get(userId);
    if (!userSockets) return;

    userSockets.delete(client.id);

    if (userSockets.size === 0) {
      this.onlineMap.delete(userId);
      console.log(`User ${userId} offline`);
      this.server.emit('userOffline', userId);
    } else {
      this.onlineMap.set(userId, userSockets);
    }

    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('getOnlineUsers')
  handleGetOnlineUsers(@ConnectedSocket() client: Socket) {
    client.emit('onlineUsers', Array.from(this.onlineMap.keys()));
  }
}