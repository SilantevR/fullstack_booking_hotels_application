import {
  Box,
  Button,
  Container,
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
import { fetchBooking, findUserBookinsData } from "../types";
import { deleteBooking } from "../services/deleteBooking";
import { useForm } from "react-hook-form";
import { Input } from "../../../components/input/components/Input";
import { fetchUserBookings } from "../services/fetchUserBookings";
import { validateId } from "../../../utils/validation";
import { styles } from "../../../styles";
import { deleteBookingByManager } from "../services/deleteBookingByManager";

export const ManagersBookingsSearch: React.FC = () => {
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userId: "",
    },
    mode: "onChange",
  });

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
    deleteBookingByManager(booking.id).then((response) => {
      if (response.status === 200) {
        handleSubmit((data) => {
          handleFindBookings(data);
        })();
      } else if (response.status === 401) {
        refreshToken(navigate).then(() => {
          deleteBookingByManager(booking.id).then((response) => {
            if (response.status === 200) {
              handleSubmit((data) => {
                handleFindBookings(data);
              })();
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

  const handleFindBookings = (data: findUserBookinsData) => {
    fetchUserBookings(
      data.userId,
      dates.length ? dates[0].startDate.toISOString() : undefined,
      dates.length ? dates[0].endDate.toISOString() : undefined
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          refreshToken(navigate).then(() => {
            fetchUserBookings(
              data.userId,
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

  return (
    <Container
      component="main"
      maxWidth="xl"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bolder",
        }}
        align="center"
      >
        Найти бронирования
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
      ) : (
        <>
          <CalendarDateRangePicker
            dates={dates}
            setDates={setDates}
          ></CalendarDateRangePicker>
        </>
      )}

      <form
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
        onSubmit={handleSubmit((data) => {
          handleFindBookings(data);
        })}
      >
        <Input
          name="userId"
          control={control}
          rules={validateId}
          errors={errors}
          label="Введите id пользователя"
        />
        <Button type="submit" fullWidth variant="contained" sx={styles.button}>
          <Search sx={{ marginRight: "10px" }} />
          Найти
        </Button>
      </form>

      {bookings.length ? bookingsList : null}
    </Container>
  );
};
