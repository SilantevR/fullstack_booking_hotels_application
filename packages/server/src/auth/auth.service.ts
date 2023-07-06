import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HashingService } from './hashing.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { TokensService } from './tokens.service';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { randomUUID } from 'crypto';
import { ActiveUserData } from './interfaces/interfaces';
import { User as IUser } from 'src/users/interfaces/interfaces';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly tokensService: TokensService,
  ) {}

  async find(signInUserDto: SignInUserDto) {
    try {
      const user = await this.usersService.findByEmail(signInUserDto.email);

      if (!user) {
        throw new UnauthorizedException({
          status: 'fail',
          description: 'Неправильный email',
        });
      } else {
        const isEqual = await this.hashingService.compare(
          signInUserDto.password,
          user.password,
        );
        if (!isEqual) {
          throw new UnauthorizedException({
            status: 'fail',
            description: 'Неправильный пароль',
          });
        }
        await this.tokensService.invalidate(user.id);
        return this.generateTokens(user);
      }
    } catch (err) {
      throw new UnauthorizedException({
        status: err.response.status,
        description: err.response.description,
      });
    }
  }
  async generateTokens(user: IUser) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        { email: user.email, role: user.role },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);
    await this.tokensService.insert(user.id, refreshTokenId);
    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
      >(refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      const user = await this.userModel.findById(sub).exec();

      if (user) {
        const isValid = await this.tokensService.validate(
          user.id,
          refreshTokenId,
        );
        if (isValid) {
          await this.tokensService.invalidate(user.id);
          return await this.generateTokens(user);
        } else {
          throw new UnauthorizedException({
            status: 'fail',
            description:
              'Токен не действителен. Учетные данные могли быть скомпроментитрованы злоумышленниками',
          });
        }
      } else {
        throw new UnauthorizedException({
          status: 'fail',
          description: 'Пользователь не найден.',
        });
      }
    } catch (err) {
      throw new UnauthorizedException({
        status: err.response.status,
        description: err.response.description,
      });
    }
  }
  private async signToken<T>(
    userId: Types.ObjectId,
    expiresIn: number,
    payload?: T,
  ) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
