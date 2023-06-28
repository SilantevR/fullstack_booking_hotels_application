import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { Document, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { HashingService } from './hashing.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData, User as IUser, IUserService } from './interfaces/interfaces';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokensService } from './tokens.service';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly tokensService: TokensService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userModel
        .findOne({ email: createUserDto.email })
        .exec();
      //console.log(user);
      if (user) {
        throw new ConflictException({
          status: 'fail',
          description: 'пользователь с таким email уже существует.',
        });
      } else {
        const password = await this.hashingService.hash(createUserDto.password);
        return await this.userModel.create({
          ...createUserDto,
          password,
        });
      }
    } catch (err) {
      throw new ConflictException({
        status: err.response.status,
        description: err.response.description,
      });
    }
  }

  async find(signInUserDto: SignInUserDto) {
    try {
      const user = await this.userModel
        .findOne({ email: signInUserDto.email })
        .exec();
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
  async generateTokens(
    user: Document<unknown, {}, User> &
      Omit<User & { _id: Types.ObjectId }, never>,
  ) {
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
  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
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
