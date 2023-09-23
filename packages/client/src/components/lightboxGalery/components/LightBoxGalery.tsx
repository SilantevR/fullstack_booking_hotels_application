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
    console.log("open");
    setState({
      currentImage: index,
      lightBoxIsOpen: true,
    });
  };
  const closeLightbox = () => {
    setState({
      currentImage: 0,
      lightBoxIsOpen: false,
    });
  };
  const gotoPrevious = () => {
    let previousIndex: number = Number(state.currentImage) - 1;
    if (previousIndex <= 0) {
      previousIndex = images.length - 1;
    }
    setState({
      currentImage: previousIndex,
      lightBoxIsOpen: true,
    });
  };
  const gotoNext = () => {
    let nextIndex: number = Number(state.currentImage) + 1;
    if (nextIndex >= images.length) {
      nextIndex = 0;
    }
    setState({
      currentImage: nextIndex,
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

      <Dialog
        maxWidth={"xl"}
        open={state.lightBoxIsOpen}
        onClose={closeLightbox}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Close
            sx={{ alignSelf: "end", cursor: "pointer" }}
            onClick={closeLightbox}
          />
          <Box>
            <ArrowBack
              sx={{
                color: "#1976d2",
                position: "absolute",
                top: "50%",
                left: "0",
                cursor: "pointer",
              }}
              onClick={gotoPrevious}
            />

            <ArrowForward
              sx={{
                color: "#1976d2",
                position: "absolute",
                top: "50%",
                right: "0",
                cursor: "pointer",
              }}
              onClick={gotoNext}
            />
          </Box>
          <img
            {...srcset(images[state.currentImage], 2000, 1800)}
            alt="фото комнаты"
            loading="lazy"
          />
        </Container>
      </Dialog>
    </>
  );
};
