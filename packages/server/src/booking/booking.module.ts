import { Token, TokenSchema } from '../auth/schemas/tokens.schema';
import { RoomsService } from 'src/hotels/rooms.service';
import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { UsersService } from 'src/users/users.service';
import { BookingSchema, Booking } from './schemas/booking.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CheckBooking } from './check.booking';
import { RoomSchema, Room } from '../hotels/schemas/room.schema';
import { HotelsService } from '../hotels/hotels.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { HashingService } from '../auth/hashing.service';
import { BcryptService } from '../auth/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TokensService } from '../auth/tokens.service';
import { HotelSchema, Hotel } from '../hotels/schemas/hotel.schema';
import { HotelsModule } from 'src/hotels/hotels.module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    forwardRef(() => HotelsModule),
  ],
  controllers: [BookingController],
  providers: [
    BookingService,
    TokensService,
    RoomsService,
    UsersService,
    CheckBooking,
    HotelsService,
    JwtService,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
  exports: [BookingService],
})
export class BookingModule {}
