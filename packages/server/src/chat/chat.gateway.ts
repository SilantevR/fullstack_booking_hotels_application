import { Socket, Server } from 'socket.io';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnEvent } from '@nestjs/event-emitter';
import { SupportRequest } from './interfaces/interfaces';
@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer() server: Server;

  handleConnection() {
    console.log('new connection!');
  }

  @OnEvent('message.send')
  handleMessage(event: SupportRequest) {
    this.server
      .to(event.id.valueOf().toString())
      .emit(`message`, event.messages[event.messages.length - 1]);
  }

  @SubscribeMessage('subscribeToChat')
  handleJoinRoom(socket: Socket, room: string) {
    socket.join(room);
    /*console.log(room);
    socket.emit('joinedToChat', { room: room });*/
  }

  @SubscribeMessage('leaveChat')
  handleLeaveRoom(socket: Socket, room: string) {
    socket.leave(room);
    /*socket.emit('leaveChat', room);*/
  }
}
