import { BASE_URL } from "../../../app/api/variables";
import { RequestOptions, Method } from "../../../app/api/types";

export const editRoom = (id: string, data: FormData): Promise<Response> => {
  const requestOptions: RequestOptions = {
    method: Method.PUT,
    body: data,
  };

  return fetch(`${BASE_URL}/admin/hotel-rooms/${id}`, {
    ...requestOptions,
    credentials: "include",
  });
};
