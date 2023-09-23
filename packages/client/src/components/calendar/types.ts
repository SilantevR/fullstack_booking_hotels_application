import { DateRange } from "../../features/search/types";

export interface CalendarDateRangeProps {
  dates: DateRange[];
  setDates: React.Dispatch<React.SetStateAction<DateRange[]>>;
}
