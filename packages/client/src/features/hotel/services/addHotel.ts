import { BASE_URL, baseOptions } from "../../../app/api/variables";
import { RequestOptions, Method } from "../../../app/api/types";
import { HotelData } from "../types";

export const addHotel = (data: HotelData): Promise<Response> => {
  const requestOptions: RequestOptions = {
    method: Method.POST,
    body: JSON.stringify(data),
  };
  return fetch(`${BASE_URL}/admin/hotels`, {
    ...requestOptions,
    ...baseOptions,
  });
};
