import { BASE_URL, baseOptions } from "../../../app/api/variables";
import { RequestOptions, Method } from "../../../app/api/types";
import { BookingData } from "../types";

export const addBooking = (data: BookingData): Promise<Response> => {
  const requestOptions: RequestOptions = {
    method: Method.POST,
    body: JSON.stringify(data),
  };
  return fetch(`${BASE_URL}/client/reservations/`, {
    ...requestOptions,
    ...baseOptions,
  });
};
