import React from "react";
import { DateRangePicker } from "react-date-range";
import locale from "date-fns/locale/ru";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DefaultDateRanges } from "../../../utils/defaultDateRange";
import { CalendarDateRangeProps } from "../types";
import { addDays } from "date-fns";

export const CalendarDateRangePicker: React.FC<CalendarDateRangeProps> = ({
  dates,
  setDates,
}) => {
  return (
    <>
      <DateRangePicker
        onChange={(item) =>
          setDates([
            {
              startDate: item.selection.startDate ?? new Date(),
              endDate: item.selection.startDate ?? addDays(new Date(), 7),
              key: item.selection.key ?? "selection",
            },
          ])
        }
        editableDateInputs={true}
        moveRangeOnFirstSelection={false}
        ranges={dates}
        months={2}
        direction="horizontal"
        className="calendarElement"
        showPreview={false}
        locale={locale}
        showDateDisplay={true}
        staticRanges={DefaultDateRanges}
        inputRanges={[]}
        dateDisplayFormat="dd.MM.yyyy"
      />
    </>
  );
};
