import React, { useContext } from "react";
import { SupportRequestItemParams } from "../types";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
  Button,
  FormHelperText,
} from "@mui/material";
import { RoutesEnum } from "../../../app/router/types";
import { Chat, MarkUnreadChatAlt } from "@mui/icons-material";
import { UserContext } from "../../../components/requireAuth/RequireAuth";

import { useServerError } from "../../../hooks/useServerError";

export const SupportRequestsItem: React.FC<SupportRequestItemParams> = ({
  supportRequest,
}) => {
  const user = useContext(UserContext);
  const { serverError, setError } = useServerError();
  const navigate = useNavigate();
  const handleSelection = () => {
    navigate(RoutesEnum.SupportRequest + "/" + supportRequest._id);
  };

  return (
    <ListItem sx={{ width: "100%" }}>
      <ListItemAvatar>
        <Avatar>
          {supportRequest.hasNewMessages ? (
            <MarkUnreadChatAlt sx={{ color: "green" }} />
          ) : (
            <Chat sx={{ color: "blue" }} />
          )}
        </Avatar>
      </ListItemAvatar>
      <Box sx={{ cursor: "pointer" }} onClick={handleSelection}>
        <ListItemText primary={supportRequest.user?.email} />

        <ListItemText
          primary={`имя: ${supportRequest.user?.name} | телефон: ${supportRequest.user?.phone}`}
          secondary={supportRequest._id}
        />
      </Box>
    </ListItem>
  );
};
