import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Role } from '../../enums/role.enum';
import { ROLES_KEY } from '../../decorator/roles.decorator';
import { ActiveUserData } from '../../interfaces/interfaces';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { Socket } from 'socket.io';
import * as dotenv from 'dotenv';
import { WsException } from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';

dotenv.config();

@Injectable()
export class WsAuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const cookies = client.handshake.headers.cookie;
    //console.log(client);
    if (!cookies) {
      throw new WsException('Авторизуйтесь, чтобы получать сообщения в чате.');
    }
    try {
      const tokens = cookies.split('; ').reduce((prev, current) => {
        const [name, ...value] = current.split('=');
        prev[name] = value.join('=');
        return prev;
      }, {});
      const payload = await this.jwtService.verifyAsync(
        tokens['accessToken'],
        this.jwtConfiguration,
      );

      const requestUserKey: string = this.configService.get(
        'REQUEST_USER_KEY',
        { infer: true },
      );

      client['requestUserKey'] = payload;

      const contextRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!contextRoles) {
        return true;
      }
      return contextRoles.some((role) => payload.role === role);
    } catch {
      throw new WsException('Авторизуйтесь, чтобы получать сообщения в чате.');
    }
  }
}
