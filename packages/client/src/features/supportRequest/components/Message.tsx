import React, { useContext } from "react";
import { MessageItemParams } from "../types";
import { UserContext } from "../../../components/requireAuth/RequireAuth";
import { Box, Paper, Typography } from "@mui/material";
import { Done } from "@mui/icons-material";

export const Message: React.FC<MessageItemParams> = ({ message }) => {
  const user = useContext(UserContext);

  const isUser = message.author._id === user.data?.id;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-start" : "flex-end",
        mb: 2,
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          backgroundColor: isUser ? "primary.light" : "secondary.light",
          borderRadius: isUser ? "20px 20px 20px 5px" : "20px 20px 5px 20px",
        }}
      >
        <Typography
          sx={{ maxWidth: "350px", wordWrap: "break-word" }}
          variant="body1"
        >
          {message.text}
        </Typography>
        <Typography
          sx={{ maxWidth: "350px", textAlign: isUser ? "right" : "left" }}
          variant="body2"
        >
          {message.readAt ? <Done /> : null}
        </Typography>
      </Paper>
    </Box>
  );
};
