export interface BookingData {
  hotelRoom: string;
  startDate: string;
  endDate: string;
}

export interface fetchBooking {
  id: string;
  dateStart: Date;
  dateEnd: Date;
  hotelRoom: {
    _id: string;
    description: string;
    images?: string[];
  };
  hotel: {
    _id: string;
    title: string;
    description: string;
  };
}

export interface findUserBookinsData {
  userId: string;
}

export interface BookingParams {
  booking: fetchBooking;
  handleDeleteBooking: (booking: fetchBooking) => void;
}
