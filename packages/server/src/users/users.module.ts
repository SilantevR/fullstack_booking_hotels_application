import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { HashingService } from '../auth/hashing.service';
import { BcryptService } from '../auth/bcrypt.service';
import jwtConfig from '../auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TokensService } from '../auth/tokens.service';
import { Token, TokenSchema } from '../auth/schemas/tokens.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    TokensService,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
