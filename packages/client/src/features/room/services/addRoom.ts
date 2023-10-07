import { BASE_URL } from "../../../app/api/variables";
import { RequestOptions, Method } from "../../../app/api/types";

export const addRoom = (data: FormData): Promise<Response> => {
  const requestOptions: RequestOptions = {
    method: Method.POST,
    body: data,
  };
  return fetch(`${BASE_URL}/admin/hotel-rooms/`, {
    ...requestOptions,
    credentials: "include",
  });
};
