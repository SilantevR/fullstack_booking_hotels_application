import { BASE_URL, baseOptions } from "../../../app/api/variables";
import { Method } from "../../../app/api/types";

export const fetchMessages = (id: string): Promise<Response> => {
  return fetch(`${BASE_URL}/common/support-requests/${id}/messages`, {
    method: Method.GET,
    ...baseOptions,
  });
};
