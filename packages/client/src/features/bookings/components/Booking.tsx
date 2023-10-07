import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardActions,
  Button,
  CardContent,
  Typography,
  FormHelperText,
  OutlinedInput,
  Box,
} from "@mui/material";
import { ImageCarousel } from "../../../components/carousel/components/Carousel";
import { RoutesEnum } from "../../../app/router/types";
import { styles } from "../../../styles";
import { fetchBooking, BookingParams } from "../types";
import { format } from "date-fns";
import { useServerError } from "../../../hooks/useServerError";

export const Booking: React.FC<BookingParams> = ({
  booking,
  handleDeleteBooking,
}) => {
  const navigate = useNavigate();
  const handleSelection = (booking: fetchBooking) => {
    navigate(RoutesEnum.Room + "/" + booking.hotelRoom._id);
  };
  const { serverError, setError } = useServerError();

  return (
    <>
      <Card sx={{ marginTop: "15px", padding: "10px", width: "100%" }}>
        <CardActionArea onClick={() => handleSelection(booking)}>
          <Typography gutterBottom variant="h5" component="div">
            Отель: {booking.hotel.title}
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            Описание отеля: {booking.hotel.description}
          </Typography>
        </CardActionArea>
        <CardContent>
          <Typography variant="body1">
            Описание номера: {booking.hotelRoom.description}
          </Typography>
        </CardContent>

        <CardContent>
          {booking.hotelRoom.images?.length ? (
            <ImageCarousel images={booking.hotelRoom.images} />
          ) : (
            <></>
          )}
        </CardContent>

        <FormHelperText
          sx={{
            color: "red",
            fontSize: 16,
          }}
        >
          {serverError}
        </FormHelperText>
        <CardContent
          sx={{
            display: "flex",

            gap: "15px",
            width: "100%",
          }}
        >
          <Box>
            <Typography gutterBottom variant="body1" component="div">
              Дата заезда
            </Typography>
            <OutlinedInput
              value={format(new Date(booking.dateStart), "dd.MM.yyyy")}
              readOnly
            />
          </Box>
          <Box>
            <Typography gutterBottom variant="body1" component="div">
              Дата выезда
            </Typography>
            <OutlinedInput
              value={format(new Date(booking.dateEnd), "dd.MM.yyyy")}
              readOnly
            />
          </Box>
          <CardActions>
            <Button
              variant="contained"
              sx={styles.button}
              onClick={() => {
                handleDeleteBooking(booking);
              }}
            >
              Отменить
            </Button>
          </CardActions>
        </CardContent>
      </Card>
    </>
  );
};
