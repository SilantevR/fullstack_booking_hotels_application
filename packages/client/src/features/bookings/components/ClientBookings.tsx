import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { CalendarDateRangePicker } from "../../../components/calendar/components/CalendarDateRangePicker";
import { addDays, format } from "date-fns";
import { DateRange } from "../../search/types";
import { Search } from "@mui/icons-material";
import { fetchClientBookings } from "../services/fetchClientBookings";
import { refreshToken } from "../../profile/services/RefreshToken";
import { useNavigate } from "react-router-dom";
import { useServerError } from "../../../hooks/useServerError";
import { Booking } from "./Booking";
import { fetchBooking } from "../types";
import { deleteBooking } from "../services/deleteBooking";
import { styles } from "../../../styles";

export const Bookings: React.FC = () => {
  const startRange: DateRange[] = [
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ];
  const [dates, setDates] = useState([] as DateRange[]);
  const [open, setOpen] = useState(false);
  const [bookings, setBookings] = useState([] as fetchBooking[]);
  const navigate = useNavigate();
  const { serverError, setError } = useServerError();

  const handleDeleteBooking = (booking: fetchBooking) => {
    deleteBooking(booking.id).then((response) => {
      if (response.status === 200) {
        handleFindBookings();
      } else if (response.status === 401) {
        refreshToken(navigate).then(() => {
          deleteBooking(booking.id).then((response) => {
            if (response.status === 200) {
              handleFindBookings();
            }
          });
        });
      } else {
        setError(new Error(`${response.statusText}`));
      }
    });
  };

  const bookingsList = bookings.map((booking) => {
    return (
      <Booking
        key={booking.id}
        booking={booking}
        handleDeleteBooking={handleDeleteBooking}
      />
    );
  });

  const handleFindBookings = () => {
    fetchClientBookings(
      dates.length ? dates[0].startDate.toISOString() : undefined,
      dates.length ? dates[0].endDate.toISOString() : undefined
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          refreshToken(navigate).then(() => {
            fetchClientBookings(
              dates.length ? dates[0].startDate.toISOString() : undefined,
              dates.length ? dates[0].endDate.toISOString() : undefined
            )
              .then((response) => {
                if (response.status === 200) {
                  return response.json();
                }
              })
              .then((result) => {
                if (result) {
                  setError(undefined);
                  setOpen(false);
                  setBookings(result);
                }
              });
          });
        } else {
          setError(new Error(`${response.statusText}`));
        }
      })
      .then((result) => {
        if (result) {
          setError(undefined);
          setOpen(false);
          setBookings(result);
        }
      });
  };

  useEffect(() => {
    handleFindBookings();
  }, []);

  return (
    <>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bolder",
        }}
        align="center"
      >
        {"Ваши бронирования"}
      </Typography>
      <FormHelperText
        sx={{
          color: "red",
          fontSize: 16,
        }}
      >
        {serverError}
      </FormHelperText>
      {!open ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            width: "100%",
          }}
        >
          <Box>
            <FormControl
              fullWidth
              sx={{ marginTop: "15px" }}
              onClick={() => {
                setDates(startRange);
                setOpen((open) => true);
              }}
            >
              <InputLabel id="check-in-label">Дата Заезда</InputLabel>
              <OutlinedInput
                label="check-in-label"
                value={`${
                  dates.length ? format(dates[0].startDate, "dd.MM.yyyy") : ""
                }`}
                readOnly
              />
            </FormControl>
          </Box>
          <Box>
            <FormControl
              fullWidth
              sx={{ marginTop: "15px" }}
              onClick={() => {
                setDates(startRange);
                setOpen((open) => true);
              }}
            >
              <InputLabel id="check-out-label">Дата Выезда</InputLabel>
              <OutlinedInput
                label="check-out-label"
                value={`${
                  dates.length ? format(dates[0]?.endDate, "dd.MM.yyyy") : ""
                }`}
                readOnly
              />
            </FormControl>
          </Box>

          <Button
            sx={styles.button}
            variant="contained"
            onClick={handleFindBookings}
          >
            <Search sx={{ marginRight: "10px" }} />
            Найти бронирования
          </Button>
        </Box>
      ) : (
        <>
          <CalendarDateRangePicker
            dates={dates}
            setDates={setDates}
          ></CalendarDateRangePicker>
          <Button
            sx={styles.button}
            fullWidth
            variant="contained"
            onClick={handleFindBookings}
          >
            <Search sx={{ marginRight: "10px" }} />
            Найти бронирования
          </Button>
        </>
      )}

      {bookings.length ? bookingsList : null}
    </>
  );
};
