import { Socket, Server } from 'socket.io';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { SupportRequestService } from './support.request.service';
import { OnEvent } from '@nestjs/event-emitter';
import { MessageCreatedEvent } from './events/message-created.event';
@WebSocketGateway({ cors: true })
export class ChatGateway {
  constructor(private readonly supportRequestService: SupportRequestService) {}
  @WebSocketServer() server: Server;

  handleConnection() {
    console.log('new connection!');
  }

  @OnEvent('message.send')
  handleMessage(event: MessageCreatedEvent) {
    //console.log(event);
    this.server.to(event.supportRequest).emit(`message`, event.message);
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
