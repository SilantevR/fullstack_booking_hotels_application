import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { HotelsController } from './hotels.controller';
import { RoomsService } from './rooms.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelSchema, Hotel } from './schemas/hotel.schema';
import { BookingSchema, Booking } from '../booking/schemas/booking.schema';
import { RoomSchema, Room } from './schemas/room.schema';
import { UsersModule } from 'src/users/users.module';
import jwtConfig from '../auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Token, TokenSchema } from '../auth/schemas/tokens.schema';
import { BookingModule } from 'src/booking/booking.module';
import { BookingService } from 'src/booking/booking.service';
import { CheckBooking } from '../booking/check.booking';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]),
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    UsersModule,
    forwardRef(() => BookingModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [HotelsController],
  providers: [HotelsService, RoomsService, BookingService, CheckBooking],
  exports: [RoomsService, HotelsService],
})
export class HotelsModule {}
