import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Typography,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import { Input } from "../../../components/input/components/Input";
import { Search as SearchIcon } from "@mui/icons-material";
import { validateHotel, validateName } from "../../../utils/validation";
import { SearchResult } from "../types";
import { DateRange } from "../types";
import { useSearchSubmit } from "../hooks/useSearchSubmit";
import { ResultsList } from "./ResultsList";
import { CalendarDateRangePicker } from "../../../components/calendar/components/CalendarDateRangePicker";
import { addDays, format } from "date-fns";

export const Search: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      hotel: "",
    },
    mode: "onChange",
  });

  const [results, setResults] = useState([] as SearchResult[]);
  const [open, setOpen] = useState(false);

  const startRange: DateRange[] = [
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ];
  const [dates, setDates] = React.useState(startRange);

  const { onSubmit, serverError } = useSearchSubmit();

  return (
    <>
      <Box
        sx={{
          marginTop: "auto",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <Typography
          variant="h5"
          color="primary"
          sx={{
            fontWeight: "bolder",
          }}
          align="center"
        >
          {"Найти варианты размещения"}
        </Typography>
        <FormHelperText
          sx={{
            color: "red",
            fontSize: 16,
          }}
        >
          {serverError}
        </FormHelperText>

        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            flexGrow: 1,
          }}
          onSubmit={handleSubmit((data) =>
            onSubmit(
              data,
              {
                startDate: dates[0].startDate ?? new Date(),
                endDate: dates[0].endDate ?? addDays(new Date(), 7),
              },
              setResults,
              setOpen
            )
          )}
        >
          <Input
            name="hotel"
            control={control}
            rules={validateHotel}
            errors={errors}
            label="Введите название отеля или оставьте пустым"
          />

          {results.length && !open ? (
            <Box sx={{ display: "flex" }}>
              <OutlinedInput
                value={`${format(
                  dates[0].startDate ?? new Date(),
                  "dd.MM.yyyy"
                )}`}
                readOnly
                onClick={() => setOpen((open) => true)}
              />
              <OutlinedInput
                value={`${format(
                  dates[0].endDate ?? addDays(new Date(), 7),
                  "dd.MM.yyyy"
                )}`}
                readOnly
                onClick={() => setOpen((open) => true)}
              />
            </Box>
          ) : (
            <>
              <CalendarDateRangePicker
                dates={dates}
                setDates={setDates}
              ></CalendarDateRangePicker>
            </>
          )}

          <Button type="submit" fullWidth variant="contained">
            <SearchIcon sx={{ marginRight: "10px" }} />
            Найти варианты
          </Button>
        </form>

        {results.length ? <ResultsList results={results} /> : <></>}
      </Box>
    </>
  );
};
