import { BASE_URL } from "../../../app/api/variables";
import { RequestOptions, Method } from "../../../app/api/types";

export const editHotel = (id: string, data: FormData): Promise<Response> => {
  const requestOptions: RequestOptions = {
    method: Method.PUT,
    body: data,
  };

  return fetch(`${BASE_URL}/admin/hotels/${id}`, {
    ...requestOptions,
    credentials: "include",
  });
};
