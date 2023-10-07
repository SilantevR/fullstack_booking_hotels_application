import { BASE_URL, baseOptions } from "../../../app/api/variables";
import { Method } from "../../../app/api/types";

export const fetchHotels = (
  limit: number,
  offset: number
): Promise<Response> => {
  const query = `?limit=${limit}&offset=${offset}`;

  return fetch(`${BASE_URL}/admin/hotels/${query}`, {
    method: Method.GET,
    ...baseOptions,
  });
};
