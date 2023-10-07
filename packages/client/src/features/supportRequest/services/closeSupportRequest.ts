import { BASE_URL, baseOptions } from "../../../app/api/variables";
import { RequestOptions, Method } from "../../../app/api/types";
import { MessageData } from "../types";

export const closeSupportRequest = (id: string): Promise<Response> => {
  const requestOptions: RequestOptions = {
    method: Method.POST,
  };
  return fetch(`${BASE_URL}/manager/support-requests/${id}/close/`, {
    ...requestOptions,
    ...baseOptions,
  });
};
