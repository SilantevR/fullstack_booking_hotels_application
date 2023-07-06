import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';
import { APP_GUARD } from '@nestjs/core';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from './users/schemas/user.schema';
import { HashingService } from './auth/hashing.service';
import { BcryptService } from './auth/bcrypt.service';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { Token, TokenSchema } from './auth/schemas/tokens.schema';
import { TokensService } from './auth/tokens.service';
import { AuthorizationGuard } from './auth/guards/authorization/authorization.guard';
import { HotelsModule } from './hotels/hotels.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BookingModule } from './booking/booking.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public/',
    }),
    UsersModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URL || 'mongodb://localhost:27017/booking',
    ),
    HotelsModule,
    BookingModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TokensService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    AccessTokenGuard,
    UsersService,
    JwtService,
  ],
})
export class AppModule {}
