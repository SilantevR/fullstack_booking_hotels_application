import { BASE_URL, baseOptions } from "../../../app/api/variables";
import { RequestOptions, Method } from "../../../app/api/types";

export const deleteBookingByManager = (id: string): Promise<Response> => {
  const requestOptions: RequestOptions = {
    method: Method.DELETE,
  };
  return fetch(`${BASE_URL}/manager/reservations/${id}`, {
    ...requestOptions,
    ...baseOptions,
  });
};
