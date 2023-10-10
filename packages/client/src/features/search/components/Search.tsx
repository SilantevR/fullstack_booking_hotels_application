import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Typography,
  OutlinedInput,
  FormHelperText,
  Pagination,
} from "@mui/material";
import { Input } from "../../../components/input/components/Input";
import { Search as SearchIcon } from "@mui/icons-material";
import { validateHotel, validateName } from "../../../utils/validation";
import { RoomData } from "../../room/types";
import { DateRange } from "../types";
import { useSearchSubmit } from "../hooks/useSearchSubmit";
import { ResultsList } from "../../../components/resultsList/components/ResultsList";
import { CalendarDateRangePicker } from "../../../components/calendar/components/CalendarDateRangePicker";
import { addDays, format } from "date-fns";
import { styles } from "../../../styles";

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
  const [results, setResults] = useState([] as RoomData[]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(10);

  const startRange: DateRange[] = [
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ];
  const [dates, setDates] = useState(startRange);

  const { onSubmit, serverError } = useSearchSubmit();

  const handlePagination = (value: number) => {
    setPage(value);
    handleSubmit((data) =>
      onSubmit(
        data,
        {
          startDate: dates[0].startDate!,
          endDate: dates[0].endDate!,
        },
        (value + 1) * limit,
        value * offset,
        setResults,
        setOpen,
        setCount
      )
    )();
    window.scrollTo(0, 0);
  };

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
          onSubmit={handleSubmit((data) => {
            setPage(0);
            onSubmit(
              data,
              {
                startDate: dates[0].startDate ?? new Date(),
                endDate: dates[0].endDate ?? addDays(new Date(), 7),
              },
              (page + 1) * limit,
              page * offset,
              setResults,
              setOpen,
              setCount
            );
          })}
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={styles.button}
          >
            <SearchIcon sx={{ marginRight: "10px" }} />
            Найти варианты
          </Button>
        </form>

        {results.length ? (
          <ResultsList results={results} dates={dates[0]} />
        ) : (
          <></>
        )}
      </Box>
      {count > 10 ? (
        <Pagination
          count={count % limit ? Math.ceil(count / limit) : count / limit}
          page={page + 1}
          onChange={(e, value) => {
            handlePagination(value - 1);
          }}
          color="secondary"
          variant="outlined"
          shape="rounded"
        />
      ) : (
        <></>
      )}
    </>
  );
};
