import React from "react";
import { useNavigate } from "react-router-dom";
import { SearchResult, ResultItem } from "../types";
import {
  Card,
  CardActionArea,
  CardActions,
  Button,
  CardContent,
  Typography,
} from "@mui/material";
import { ImageCarousel } from "../../../components/carousel/components/Carousel";
import { RoutesEnum } from "../../../app/router/types";

export const ListItem: React.FC<ResultItem> = ({ result }) => {
  const navigate = useNavigate();
  const handleSelection = (result: SearchResult) => {
    navigate(RoutesEnum.Room + "/" + result._id);
  };

  return (
    <>
      <Card sx={{ marginTop: "10px", padding: "10px" }}>
        <CardContent>
          <ImageCarousel images={result.images} />
        </CardContent>
        <CardActionArea onClick={() => handleSelection(result)}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Отель: {result.hotel?.title}
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
              Номер: {result.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Описание: {result.description}
            </Typography>
          </CardContent>
        </CardActionArea>

        <CardActions>
          <Button size="medium" color="primary">
            Забронировать
          </Button>
        </CardActions>
      </Card>
    </>
  );
};
