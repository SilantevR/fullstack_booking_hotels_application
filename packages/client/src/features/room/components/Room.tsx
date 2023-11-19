import React, { useState, useEffect, useContext } from "react";
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
import { RoomData } from "../types";
import { LightBoxGalery } from "../../../components/lightboxGalery/components/LightBoxGalery";
import { styles } from "../../../styles";
import { refreshToken } from "../../profile/services/RefreshToken";
import { UserContext } from "../../../components/requireAuth/RequireAuth";
import { EditRoom } from "./EditRoom";
import { useForm } from "react-hook-form";
import { ImagesList } from "../../../components/imageList/components/ImagesList";
import { BASE_URL, PUBLIC_URL } from "../../../app/api/variables";

export const Room: React.FC = () => {
  const { serverError, setError } = useServerError();
  const { id } = useParams();
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const [room, setRoom] = useState({} as RoomData);
  const [edit, setEdit] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: room?.title || "",
      description: room?.description || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (id) {
      fetchRoom(id)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else if (response.status === 401) {
            refreshToken(navigate).then(() => {
              fetchRoom(id)
                .then((response) => {
                  if (response.status === 200) {
                    return response.json();
                  }
                })
                .then((result) => {
                  if (result) {
                    setRoom(result);
                    setValue("title", result.title);
                    setValue("description", result.description);
                    setIsEnabled(result.isEnabled);
                  }
                });
            });
          } else {
            setError(new Error(`${response.statusText}`));
          }
        })
        .then((result: RoomData) => {
          if (result) {
            setRoom(result);
            setValue("title", result.title);
            setValue("description", result.description);
            setIsEnabled(result.isEnabled);
          }
        });
    } else {
      navigate(RoutesEnum.ServerError);
    }
  }, []);

  const handleSelection = (id: string) => {
    if (id && user.data?.role === "admin") {
      navigate(RoutesEnum.Hotel + "/" + id);
    } else {
      setError(new Error(`Страница отеля доступна только администратору`));
    }
  };

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
          {edit ? (
            <EditRoom
              room={room}
              setRoom={setRoom}
              setEdit={setEdit}
              control={control}
              errors={errors}
              handleSubmit={handleSubmit}
              isEnabled={isEnabled}
              setIsEnabled={setIsEnabled}
            />
          ) : (
            <CardContent sx={{ margin: "auto" }}>
              <CardActionArea onClick={() => handleSelection(room.hotel?._id!)}>
                <Typography gutterBottom variant="h5" component="div">
                  Отель: {room.hotel?.title}
                </Typography>
                <Typography gutterBottom variant="body2" component="div">
                  Описание: {room.hotel?.description}
                </Typography>
              </CardActionArea>
              {room.hotel?.images ? (
                <ImagesList
                  images={room.hotel?.images}
                  url={`${PUBLIC_URL}/`}
                />
              ) : null}

              <Typography gutterBottom variant="h5" component="div">
                Номер: {room.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Описание: {room.description}
              </Typography>
              {user.data?.role === "admin" ? (
                <CardActions>
                  <Button
                    variant="contained"
                    sx={styles.button}
                    onClick={() => setEdit(true)}
                  >
                    Редактировать
                  </Button>
                </CardActions>
              ) : null}

              <LightBoxGalery images={room.images}></LightBoxGalery>
            </CardContent>
          )}
        </Card>
      ) : null}
    </>
  );
};
