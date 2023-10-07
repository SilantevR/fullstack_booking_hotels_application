import { BASE_URL, baseOptions } from "../../../app/api/variables";
import { Method } from "../../../app/api/types";

export const fetchClientBookings = (
  dateStart: string | undefined,
  dateEnd: string | undefined
): Promise<Response> => {
  const query =
    `?${dateStart ? `dateStart=${dateStart}` : ""}` +
    `${dateEnd ? `&dateEnd=${dateEnd}` : ""}`;

  return fetch(`${BASE_URL}/client/reservations/${query}`, {
    method: Method.GET,
    ...baseOptions,
  });
};
