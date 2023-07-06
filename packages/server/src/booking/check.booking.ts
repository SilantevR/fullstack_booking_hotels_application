import { Reservation, ReservationDto } from './interfaces/interfaces';

export class CheckBooking {
  check(date: string, existBookingDates: ReservationDto) {
    const d1 = new Date(date).getTime();
    const dS = new Date(existBookingDates.dateStart).getTime();
    const dE = new Date(existBookingDates.dateEnd).getTime();
    if (d1 >= dS && d1 <= dE) {
      return true;
    }
    return false;
  }
}
