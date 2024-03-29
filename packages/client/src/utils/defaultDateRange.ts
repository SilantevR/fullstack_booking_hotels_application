import {
  addDays,
  endOfDay,
  startOfDay,
  startOfMonth,
  endOfMonth,
  addMonths,
  startOfWeek,
  endOfWeek,
  isSameDay,
  differenceInCalendarDays,
} from "date-fns";
import { Range } from "react-date-range";

export const DefaultDateRanges = [
  {
    label: "Текущая неделя",
    range: () => ({
      startDate: new Date(),
      endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
    }),
    isSelected(range: Range) {
      const definedRange = this.range();
      return (
        isSameDay(range.startDate ?? 0, definedRange.startDate ?? new Date()) &&
        isSameDay(
          range.endDate ?? 0,
          definedRange.endDate ?? addDays(new Date(), +7)
        )
      );
    },
  },
  {
    label: "Следующая неделя",
    range: () => ({
      startDate: startOfWeek(addDays(new Date(), +7), { weekStartsOn: 1 }),
      endDate: endOfWeek(addDays(new Date(), +7), { weekStartsOn: 1 }),
    }),
    isSelected(range: Range) {
      const definedRange = this.range();
      return (
        isSameDay(range.startDate ?? 0, definedRange.startDate ?? new Date()) &&
        isSameDay(
          range.endDate ?? 0,
          definedRange.endDate ?? addDays(new Date(), +7)
        )
      );
    },
  },
  {
    label: "Следующие 2 недели",
    range: () => ({
      startDate: startOfWeek(addDays(new Date(), +7), { weekStartsOn: 1 }),
      endDate: endOfWeek(addDays(new Date(), +14), { weekStartsOn: 1 }),
    }),
    isSelected(range: Range) {
      const definedRange = this.range();
      return (
        isSameDay(range.startDate ?? 0, definedRange.startDate ?? new Date()) &&
        isSameDay(
          range.endDate ?? 0,
          definedRange.endDate ?? addDays(new Date(), +7)
        )
      );
    },
  },
];
