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
import { lightBoxGaleryProps, lightBoxProps } from "../types";
import {
  ArrowBack,
  ArrowForward,
  Close,
  StarBorder,
} from "@mui/icons-material";

export const LightBox: React.FC<lightBoxProps> = ({
  images,
  url,
  state,
  setState,
}) => {
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
            src={`${url}${images[state.currentImage]}`}
            alt="фото комнаты"
            loading="lazy"
          />
        </Container>
      </Dialog>
    </>
  );
};
