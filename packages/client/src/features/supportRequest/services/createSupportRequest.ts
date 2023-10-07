import { BASE_URL, baseOptions } from "../../../app/api/variables";
import { RequestOptions, Method } from "../../../app/api/types";
import { MessageData } from "../types";

export const createSupportRequest = (data: MessageData): Promise<Response> => {
  const requestOptions: RequestOptions = {
    method: Method.POST,
    body: JSON.stringify(data),
  };
  return fetch(`${BASE_URL}/client/support-requests/`, {
    ...requestOptions,
    ...baseOptions,
  });
};
