import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ActiveUser } from '../auth/decorator/active-user.decorator';
import { ActiveUserData } from '../auth/interfaces/interfaces';
import { Types } from 'mongoose';

@Controller('api')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('/client/reservations')
  createBooking(
    @ActiveUser('sub') id: ActiveUserData['sub'],
    @Body(new ValidationPipe()) createBookingDto: CreateBookingDto,
  ) {
    return this.bookingService.addReservation(id, createBookingDto);
  }

  @Get('/client/reservations')
  findBooking(
    @ActiveUser('sub') id: ActiveUserData['sub'],
    @Query('dateStart') dateStart: Date,
    @Query('dateEnd') dateEnd: Date,
  ) {
    return this.bookingService.getReservations({
      userId: id,
      dateStart,
      dateEnd,
    });
  }

  @Delete('/client/reservations/:id')
  removeBooking(@Param('id') id: Types.ObjectId) {
    return this.bookingService.removeReservation(id);
  }

  @Get('/manager/reservations/:userId')
  getUserBookings(
    @Param('userId') userId: Types.ObjectId,
    @Query('dateStart') dateStart: Date,
    @Query('dateEnd') dateEnd: Date,
  ) {
    return this.bookingService.getReservations({
      userId,
      dateStart,
      dateEnd,
    });
  }

  @Delete('/manager/reservations/:id')
  RemoveUserBooking(@Param('id') id: Types.ObjectId) {
    return this.bookingService.removeReservation(id);
  }
}
