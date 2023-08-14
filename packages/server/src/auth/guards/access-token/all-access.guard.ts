import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AllAccessGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['accessToken'] ?? [];
    if (!token) {
      return true;
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      const requestUserKey: string = this.configService.get(
        'REQUEST_USER_KEY',
        { infer: true },
      );
      request[requestUserKey] = payload;
      //console.log(payload);
      return true;
    } catch {
      return true;
    }
  }
}
