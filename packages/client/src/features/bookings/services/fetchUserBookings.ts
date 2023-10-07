import { BASE_URL, baseOptions } from "../../../app/api/variables";
import { Method } from "../../../app/api/types";

export const fetchUserBookings = (
  userId: string | undefined,
  dateStart: string | undefined,
  dateEnd: string | undefined
): Promise<Response> => {
  const query =
    `?${dateStart ? `dateStart=${dateStart}` : ""}` +
    `${dateEnd ? `&dateEnd=${dateEnd}` : ""}`;

  return fetch(`${BASE_URL}/manager/reservations/${userId}/${query}`, {
    method: Method.GET,
    ...baseOptions,
  });
};
