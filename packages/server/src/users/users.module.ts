import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { HashingService } from './hashing.service';
import { BcryptService } from './bcrypt.service';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TokensService } from './tokens.service';
import { Token, TokenSchema } from './schemas/tokens.schema';

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
