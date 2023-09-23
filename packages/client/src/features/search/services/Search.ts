import { BASE_URL, baseOptions } from "../../../app/api/variables";
import { Method } from "../../../app/api/types";
import { SearchData, SearchDates } from "../types";

export const search = (
  data: SearchData,
  dates: SearchDates
): Promise<Response> => {
  const query = `?${
    data.hotel ? `hotel=${encodeURIComponent(data.hotel)}&` : ""
  }startDate=${dates.startDate.toISOString()}&endDate=${dates.endDate.toISOString()}&limit=10&offset=0}`;

  return fetch(`${BASE_URL}/common/hotel-rooms${query}`, {
    method: Method.GET,
    ...baseOptions,
  });
};
