import React from "react";
import { useNavigate } from "react-router-dom";
import { ResultItem, SearchDates } from "../../../features/search/types";
import { RoomData } from "../../../features/room/types";
import {
  Card,
  CardActionArea,
  CardActions,
  Button,
  CardContent,
  Typography,
  FormHelperText,
} from "@mui/material";
import { ImageCarousel } from "../../carousel/components/Carousel";
import { RoutesEnum } from "../../../app/router/types";
import { styles } from "../../../styles";
import { useAddBooking } from "../../../features/bookings/hooks/useAddBooking";

export const ListItem: React.FC<ResultItem> = ({ result, dates }) => {
  const navigate = useNavigate();
  const handleSelection = (result: RoomData) => {
    navigate(RoutesEnum.Room + "/" + result._id);
  };

  const { handleAddBooking, serverError } = useAddBooking();

  return (
    <>
      <Card sx={{ marginTop: "15px", padding: "10px", width: "100%" }}>
        <CardContent>
          <CardActionArea onClick={() => handleSelection(result)}>
            <Typography gutterBottom variant="h5" component="div">
              Номер: {result.title}
            </Typography>
            <Typography gutterBottom variant="h6" component="div">
              Отель: {result.hotel?.title}
            </Typography>
          </CardActionArea>
          <CardContent>
            <Typography variant="body1">
              Описание: {result.description}
            </Typography>
          </CardContent>
          {result.images.length ? (
            <ImageCarousel images={result.images} />
          ) : (
            <></>
          )}
        </CardContent>

        {dates ? (
          <>
            <FormHelperText
              sx={{
                color: "red",
                fontSize: 16,
              }}
            >
              {serverError}
            </FormHelperText>
            <CardActions>
              <Button
                variant="contained"
                sx={styles.button}
                onClick={() => {
                  handleAddBooking({
                    hotelRoom: result._id,
                    startDate: dates.startDate.toISOString(),
                    endDate: dates.endDate.toISOString(),
                  });
                }}
              >
                Забронировать
              </Button>
            </CardActions>
          </>
        ) : (
          <></>
        )}
      </Card>
    </>
  );
};
