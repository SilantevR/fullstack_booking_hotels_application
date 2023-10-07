import {
  Box,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import React, { useState } from "react";
import { lightBoxGaleryProps } from "../types";
import {
  ArrowBack,
  ArrowForward,
  Close,
  StarBorder,
} from "@mui/icons-material";
import { useMediaQuery, useTheme } from "@mui/material";
import { LightBox } from "./LightBox";

function srcset(
  image: string,
  width: number,
  height: number,
  rows = 1,
  cols = 1
) {
  return {
    src: `http://localhost:5000/${image}?w=${width * cols}&h=${
      height * rows
    }&fit=crop&auto=format`,
    srcSet: `http://localhost:5000/${image}?w=${width * cols}&h=${
      height * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

export const LightBoxGalery: React.FC<lightBoxGaleryProps> = ({ images }) => {
  const [state, setState] = useState({
    currentImage: 0,
    lightBoxIsOpen: false,
  });

  const openLightbox = (index: number) => {
    setState({
      currentImage: index,
      lightBoxIsOpen: true,
    });
  };

  return (
    <>
      <ImageList
        sx={{
          width: 600,
          height: 600,
          transform: "translateZ(0)",
        }}
        rowHeight={200}
        gap={1}
      >
        {images.map((item, index) => {
          const cols = index % 3 ? 1 : 2;
          const rows = index % 3 ? 1 : 2;
          return (
            <ImageListItem
              key={index}
              cols={cols}
              rows={rows}
              sx={{ cursor: "pointer" }}
              onClick={() => openLightbox(index)}
            >
              <img
                {...srcset(item, 300, 200, rows, cols)}
                alt="фото комнаты"
                loading="lazy"
              />
              <ImageListItemBar
                sx={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
                    "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                }}
                position="top"
              />
            </ImageListItem>
          );
        })}
      </ImageList>

      <LightBox
        images={images}
        state={state}
        setState={setState}
        url={`http://localhost:5000/`}
      />
    </>
  );
};
