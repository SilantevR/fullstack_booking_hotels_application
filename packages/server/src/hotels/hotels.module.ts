import { Module } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { HotelsController } from './hotels.controller';
import { RoomsService } from './rooms.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelSchema, Hotel } from './schemas/hotel.schema';
import { RoomSchema, Room } from './schemas/room.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]),
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
  ],
  controllers: [HotelsController],
  providers: [HotelsService, RoomsService],
})
export class HotelsModule {}
