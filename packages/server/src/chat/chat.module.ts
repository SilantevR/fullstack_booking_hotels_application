import { Module } from '@nestjs/common';
import { SupportRequestEmployeeService } from './support.request.employee.service';
import { SupportRequestClientService } from './support.request.client.service';
import { SupportRequestService } from './support.request.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema, Message } from './schemas/message.schema';
import {
  SupportRequestSchema,
  SupportRequest,
} from './schemas/support-request.schema';
import { UserSchema, User } from 'src/users/schemas/user.schema';
import { TokenSchema, Token } from 'src/auth/schemas/tokens.schema';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { HashingService } from '../auth/hashing.service';
import { BcryptService } from '../auth/bcrypt.service';

@Module({
  providers: [
    ChatGateway,
    SupportRequestService,
    SupportRequestClientService,
    SupportRequestEmployeeService,
    UsersService,
    JwtService,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
  controllers: [ChatController],
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
})
export class ChatModule {}
