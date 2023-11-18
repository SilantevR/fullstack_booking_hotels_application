import React from "react";
import { ListItem } from "@mui/material";
export const ImageItem: React.FC<{
  result: string;
  index: number;
  openLightBox: (index: number) => void;
  url: string;
}> = ({ result, index, openLightBox, url }) => {
  return (
    <ListItem
      onClick={() => {
        openLightBox(index);
      }}
      sx={{ cursor: "pointer", maxWidth: "220px" }}
    >
      <img
        src={result ? `${url + result}` : ""}
        alt="Фото отеля"
        height="100"
        width="200"
      />
    </ListItem>
  );
};
