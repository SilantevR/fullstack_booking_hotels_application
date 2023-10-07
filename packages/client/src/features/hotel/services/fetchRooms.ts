import { BASE_URL, baseOptions } from "../../../app/api/variables";
import { Method } from "../../../app/api/types";

export const fetchRooms = (id: string): Promise<Response> => {
  return fetch(`${BASE_URL}/common/hotel-rooms/?hotel=${id}`, {
    method: Method.GET,
    ...baseOptions,
  });
};
