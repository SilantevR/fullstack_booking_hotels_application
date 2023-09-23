import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchRoom } from "../services/fetchRoom";
import { useServerError } from "../../../hooks/useServerError";
import { RoutesEnum } from "../../../app/router/types";
import {
  Paper,
  Card,
  CardActionArea,
  CardActions,
  Button,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import { ImageCarousel } from "../../../components/carousel/components/Carousel";
import { SearchResult } from "../../search/types";
import { LightBoxGalery } from "../../../components/lightboxGalery/components/LightBoxGalery";

export const Room: React.FC = () => {
  const { serverError, setError } = useServerError();
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState({} as SearchResult);

  useEffect(() => {
    if (id) {
      fetchRoom(id)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            setError(new Error(`${response.statusText}`));
          }
        })
        .then((result: SearchResult) => {
          setRoom(result);
        })
        .catch(setError);
    } else {
      navigate(RoutesEnum.ServerError);
    }
  }, []);

  return (
    <>
      {room._id ? (
        <Card
          sx={{
            marginTop: "10px",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent sx={{ margin: "auto" }}>
            <Typography gutterBottom variant="h5" component="div">
              Отель: {room.hotel?.title}
            </Typography>
            <Typography gutterBottom variant="body2" component="div">
              Описание: {room.hotel?.description}
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
              Номер: {room.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Описание: {room.description}
            </Typography>
            <CardActions>
              <Button size="medium" color="primary">
                Забронировать
              </Button>
            </CardActions>

            <LightBoxGalery images={room.images}></LightBoxGalery>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
};
