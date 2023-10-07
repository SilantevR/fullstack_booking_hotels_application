import { BASE_URL, baseOptions } from "../../../app/api/variables";
import { Method } from "../../../app/api/types";
import { SearchData, SearchDates } from "../types";

export const search = (
  data: SearchData,
  dates: SearchDates,
  limit: number,
  offset: number
): Promise<Response> => {
  const query = `?${
    data.hotel ? `title=${encodeURIComponent(data.hotel)}&` : ""
  }startDate=${dates.startDate.toISOString()}&endDate=${dates.endDate.toISOString()}&limit=${limit}&offset=${offset}`;

  return fetch(`${BASE_URL}/common/hotel-rooms${query}`, {
    method: Method.GET,
    ...baseOptions,
  });
};
