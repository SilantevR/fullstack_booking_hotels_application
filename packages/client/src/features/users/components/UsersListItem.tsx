import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
} from "@mui/material";
import { RoutesEnum } from "../../../app/router/types";
import { Person } from "@mui/icons-material";
import { FetchUserData } from "../types";

export const UsersListItem: React.FC<{ user: FetchUserData }> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <ListItem sx={{ width: "100%" }}>
      <ListItemAvatar>
        <Avatar>
          <Person sx={{ color: "blue" }} />
        </Avatar>
      </ListItemAvatar>
      <Box>
        <ListItemText primary={user.email} />
        <ListItemText
          primary={`имя: ${user.name} | роль: ${user.role} | телефон: ${user.phone}`}
          secondary={user._id}
        />
      </Box>
    </ListItem>
  );
};
