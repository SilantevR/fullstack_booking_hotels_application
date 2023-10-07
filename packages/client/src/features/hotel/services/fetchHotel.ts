import { BASE_URL, baseOptions } from "../../../app/api/variables";
import { Method } from "../../../app/api/types";

export const fetchHotel = (id: string): Promise<Response> => {
  return fetch(`${BASE_URL}/admin/hotels/${id}`, {
    method: Method.GET,
    ...baseOptions,
  });
};
