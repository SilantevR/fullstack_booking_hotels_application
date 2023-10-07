import { BASE_URL, baseOptions } from "../../../app/api/variables";
import { RequestOptions, Method } from "../../../app/api/types";
import { MessageData } from "../types";

export const sendMessage = (
  id: string,
  data: MessageData
): Promise<Response> => {
  const requestOptions: RequestOptions = {
    method: Method.POST,
    body: JSON.stringify(data),
  };
  return fetch(`${BASE_URL}/common/support-requests/${id}/messages`, {
    ...requestOptions,
    ...baseOptions,
  });
};
