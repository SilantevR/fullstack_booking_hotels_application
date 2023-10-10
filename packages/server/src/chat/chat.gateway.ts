import { Socket, Server } from 'socket.io';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { WsExceptionFilter } from './ws.exception.filter';
import { UseGuards, UseFilters } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SupportRequest } from './interfaces/interfaces';
import { WsAuthorizationGuard } from 'src/auth/guards/ws-authorization/ws-authorization.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ConfigService } from '@nestjs/config';
import { SupportRequestService } from './support.request.service';
import { WsException } from '@nestjs/websockets';
@WebSocketGateway({
  cors: {
    origin: process.env.SOKET_ORIGIN
      ? `${process.env.SOKET_ORIGIN}`
      : 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer() server: Server;
  constructor(
    private configService: ConfigService,
    private readonly supportRequestService: SupportRequestService,
  ) {}

  @OnEvent('message.send')
  handleMessage(event: SupportRequest) {
    this.server
      .to(event.id.valueOf().toString())
      .emit(`message`, event.messages[event.messages.length - 1]);
  }

  @Roles(Role.Client, Role.Manager)
  @UseGuards(WsAuthorizationGuard)
  @UseFilters(new WsExceptionFilter())
  @SubscribeMessage('subscribeToChat')
  async handleJoinRoom(socket: Socket, room: string) {
    const requestUserKey: string = this.configService.get('REQUEST_USER_KEY', {
      infer: true,
    });
    if (socket[requestUserKey].role === 'client') {
      const supportRequest =
        await this.supportRequestService.findSupportRequestById(room);
      if (socket[requestUserKey].sub === supportRequest.user.id) {
        socket.join(room);
      } else {
        throw new WsException(
          'Чат для Вас не доступен, обратитесь к администратору',
        );
      }
    } else {
      socket.join(room);
    }

    socket.emit('joinedToChat', { status: 'ОК', join: room });
  }

  @SubscribeMessage('leaveChat')
  handleLeaveRoom(socket: Socket, room: string) {
    socket.leave(room);
    socket.emit('leaveChat', { status: 'ОК', leave: room });
    socket.disconnect();
  }
}
