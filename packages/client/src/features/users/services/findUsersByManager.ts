import { BASE_URL, baseOptions } from "../../../app/api/variables";
import { Method } from "../../../app/api/types";

export const findUsersByManager = (
  limit: number,
  offset: number,
  email?: string | undefined,
  name?: string | undefined,
  contactPhone?: string | undefined
): Promise<Response> => {
  const query =
    `?${email ? `email=${email}` : ""}` +
    `${name ? `&name=${encodeURIComponent(name)}` : ""}` +
    `${contactPhone ? `&contactPhone=${contactPhone}` : ""}` +
    `${limit ? `&limit=${limit}` : ""}` +
    `${offset ? `&offset=${offset}` : ""}`;

  return fetch(`${BASE_URL}/manager/users/${query}`, {
    method: Method.GET,
    ...baseOptions,
  });
};
