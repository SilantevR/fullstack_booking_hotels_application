import React from "react";
import { useNavigate } from "react-router-dom";
import { RoomData } from "../../room/types";
import {
  Typography,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import { RoutesEnum } from "../../../app/router/types";
import { HomeWork } from "@mui/icons-material";
import { FetchHotelData } from "../types";

export const HotelListItem: React.FC<{ hotel: FetchHotelData }> = ({
  hotel,
}) => {
  const navigate = useNavigate();
  const handleSelection = () => {
    navigate(RoutesEnum.Hotel + "/" + hotel._id);
  };

  return (
    <>
      <ListItem onClick={handleSelection}>
        <ListItemAvatar>
          <Avatar>
            <HomeWork />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={hotel.title} secondary={hotel._id} />
      </ListItem>
    </>
  );
};
