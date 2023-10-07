import { BASE_URL } from "../../../app/api/variables";
import { RequestOptions, Method } from "../../../app/api/types";
import { baseOptions } from "../../../app/api/variables";
import { FetchHotelData } from "../types";

export const removeImage = (
  data: FetchHotelData,
  src: string
): Promise<Response> => {
  const requestOptions: RequestOptions = {
    method: Method.DELETE,
    body: JSON.stringify({ hotel: data, src: src }),
  };

  return fetch(`${BASE_URL}/admin/hotels/images/${data._id}`, {
    ...requestOptions,
    ...baseOptions,
  });
};
