import React from "react";
import { Box, Typography } from "@mui/material";
import { Lists } from "../types";

export const ListProfile: React.FC<Lists> = ({ label, defaultVal }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">{label}</Typography>
        <Typography variant="h6" color="primary">
          {defaultVal ? defaultVal : ""}
        </Typography>
      </Box>
      <hr style={{ width: "100%" }} />
    </>
  );
};
