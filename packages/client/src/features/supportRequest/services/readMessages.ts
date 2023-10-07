import { BASE_URL, baseOptions } from "../../../app/api/variables";
import { RequestOptions, Method } from "../../../app/api/types";
import { ReadMessageData } from "../types";

export const readMessages = (
  id: string,
  data: ReadMessageData
): Promise<Response> => {
  const requestOptions: RequestOptions = {
    method: Method.POST,
    body: JSON.stringify(data),
  };
  return fetch(`${BASE_URL}/common/support-requests/${id}/messages/read`, {
    ...requestOptions,
    ...baseOptions,
  });
};
