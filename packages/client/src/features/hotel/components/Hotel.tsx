import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchHotel } from "../services/fetchHotel";
import { FetchHotelData, UploadImage } from "../types";

import { RoutesEnum } from "../../../app/router/types";
import { useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Input as FileInput,
  FormHelperText,
} from "@mui/material";

import { format } from "date-fns";
import { styles } from "../../../styles";

import { ImagesList } from "../../../components/imageList/components/ImagesList";
import { PUBLIC_URL } from "../../../app/api/variables";
import { EditHotel } from "./EditHotel";
import { fetchRooms } from "../services/fetchRooms";
import { RoomData } from "../../room/types";
import { ResultsList } from "../../../components/resultsList/components/ResultsList";
import { refreshToken } from "../../profile/services/RefreshToken";

export const Hotel: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState({} as FetchHotelData);
  const [edit, setEdit] = useState(false);
  const [rooms, setRooms] = useState([] as RoomData[]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: hotel?.title || "",
      description: hotel?.description || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (id) {
      fetchHotel(id)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else if (response.status === 401) {
            refreshToken(navigate).then(() => {
              fetchHotel(id)
                .then((response) => {
                  if (response.status === 200) {
                    return response.json();
                  }
                })
                .then((result) => {
                  if (result) {
                    setHotel(result);
                    setValue("title", result.title);
                    setValue("description", result.description);
                  }
                });
            });
          } else {
            navigate(RoutesEnum.ServerError);
          }
        })
        .then((result: FetchHotelData) => {
          if (result) {
            setHotel(result);
            setValue("title", result.title);
            setValue("description", result.description);
          }
        });
    } else {
      navigate(RoutesEnum.ServerError);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchRooms(id)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else if (response.status === 401) {
            refreshToken(navigate).then(() => {
              fetchRooms(id)
                .then((response) => {
                  if (response.status === 200) {
                    return response.json();
                  }
                })
                .then((result) => {
                  if (result) {
                    setRooms(result.result);
                  }
                });
            });
          } else {
            navigate(RoutesEnum.ServerError);
          }
        })
        .then((result) => {
          if (result) {
            setRooms(result.result);
          }
        });
    } else {
      navigate(RoutesEnum.ServerError);
    }
  }, [hotel]);

  return (
    <>
      {hotel?._id ? (
        <Card
          sx={{
            marginTop: "10px",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {edit ? (
            <EditHotel
              hotel={hotel}
              setHotel={setHotel}
              setEdit={setEdit}
              control={control}
              errors={errors}
              handleSubmit={handleSubmit}
            />
          ) : (
            <>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Отель: {hotel.title}
                </Typography>

                <Typography gutterBottom variant="body1" component="div">
                  Описание: {hotel.description}
                </Typography>
                <Typography gutterBottom variant="body2" component="div">
                  Создан: {format(new Date(hotel.createdAt), "dd.MM.yyyy")}
                </Typography>
                <Typography gutterBottom variant="body2" component="div">
                  Последнее изменеие:{" "}
                  {format(new Date(hotel.updatedAt), "dd.MM.yyyy")}
                </Typography>
                {hotel.images?.length ? (
                  <ImagesList images={hotel.images} url={`${PUBLIC_URL}/`} />
                ) : (
                  <></>
                )}
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  sx={styles.button}
                  onClick={() => setEdit(true)}
                >
                  Редактировать
                </Button>
                <Button
                  variant="contained"
                  sx={styles.button}
                  onClick={() => navigate(RoutesEnum.AddRoom + "/" + hotel._id)}
                >
                  Добавить номер
                </Button>
              </CardActions>
            </>
          )}
        </Card>
      ) : null}

      {rooms.length && !edit ? <ResultsList results={rooms} /> : <></>}
    </>
  );
};
