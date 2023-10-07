import { BASE_URL, baseOptions } from "../../../app/api/variables";
import { Method } from "../../../app/api/types";

export const fetchManagerSupportRequests = (
  isActive: boolean,
  limit: number,
  offset: number
): Promise<Response> => {
  const query =
    `?isActive=${isActive}` +
    `${limit ? `&limit=${limit}` : ""}` +
    `${offset ? `&offset=${offset}` : ""}`;

  return fetch(`${BASE_URL}/manager/support-requests/${query}`, {
    method: Method.GET,
    ...baseOptions,
  });
};
