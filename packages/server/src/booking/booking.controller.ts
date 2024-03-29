import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Delete,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ActiveUser } from '../auth/decorator/active-user.decorator';
import { ActiveUserData } from '../auth/interfaces/interfaces';
import { Types } from 'mongoose';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('api')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @HttpCode(HttpStatus.OK)
  @Roles(Role.Client)
  @Post('/client/reservations')
  createBooking(
    @ActiveUser('sub') id: ActiveUserData['sub'],
    @Body(new ValidationPipe()) createBookingDto: CreateBookingDto,
  ) {
    return this.bookingService.addReservation(id, createBookingDto);
  }

  @Roles(Role.Client)
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

  @Roles(Role.Client)
  @Delete('/client/reservations/:id')
  removeBooking(@Param('id') id: Types.ObjectId) {
    return this.bookingService.removeReservation(id);
  }

  @Roles(Role.Manager)
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

  @Roles(Role.Manager)
  @Delete('/manager/reservations/:id')
  RemoveUserBooking(@Param('id') id: Types.ObjectId) {
    return this.bookingService.removeReservation(id);
  }
}
