import { Socket, Server } from 'socket.io';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { SupportRequestService } from './support.request.service';

@WebSocketGateway()
export class ChatGateway {
  constructor(private readonly chatService: SupportRequestService) {}
  @WebSocketServer() server: Server;

  handleConnection() {
    console.log('new connection!');
  }

  @SubscribeMessage('message')
  handleMessage(
    socket: Socket,
    message: { sender: string; room: string; message: string },
  ) {
    this.server.to(message.room).emit('messageToClient', message);
    return;
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(socket: Socket, room: string) {
    socket.join(room);
    socket.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(socket: Socket, room: string) {
    socket.leave(room);
    socket.emit('leftRoom', room);
  }
}
