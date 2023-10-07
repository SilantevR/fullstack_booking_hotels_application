import { BASE_URL } from "../../../app/api/variables";
import { RequestOptions, Method } from "../../../app/api/types";
import { baseOptions } from "../../../app/api/variables";
import { RoomData } from "../types";

export const removeRoomImage = (
  data: RoomData,
  src: string
): Promise<Response> => {
  const requestOptions: RequestOptions = {
    method: Method.DELETE,
    body: JSON.stringify({ room: data, src: src }),
  };

  return fetch(`${BASE_URL}/admin/hotel-rooms/images/${data._id}`, {
    ...requestOptions,
    ...baseOptions,
  });
};
