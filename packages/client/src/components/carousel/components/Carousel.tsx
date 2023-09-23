import React, { useState } from "react";
import { Container } from "@mui/system";
import {
  CarouselProvider,
  Slider,
  Slide,
  ImageWithZoom,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import Stack from "@mui/material/Stack";
import { Box, CardMedia } from "@mui/material";
import { ArrowForward, ArrowBack } from "@mui/icons-material";
import { CarouselProps } from "../types";

export const ImageCarousel: React.FC<CarouselProps> = (props) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageData, setImageData] = useState(props.images);

  const handleClickPreviousEvent = () => {
    setCurrentSlide(currentSlide - 1);
    if (currentSlide <= 0) {
      setCurrentSlide(imageData.length - 1);
    }
  };

  const handleClickNextEvent = () => {
    setCurrentSlide(currentSlide + 1);
    if (currentSlide >= imageData.length - 1) {
      setCurrentSlide(0);
    }
  };

  return (
    <Container sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Stack direction="row" spacing={1} sx={{ maxHeight: 60, maxWidth: 800 }}>
        {props.images.map((item, index) => (
          <Box
            key={index}
            sx={{ maxWidth: 50, maxHeight: 50, cursor: "pointer" }}
            onClick={() => setCurrentSlide(index)}
          >
            <CardMedia
              component="img"
              height="50"
              image={`http://localhost:5000/${props.images[index]}`}
              alt="фото номера"
            />
          </Box>
        ))}
      </Stack>

      <CarouselProvider
        visibleSlides={1}
        totalSlides={props.images.length}
        currentSlide={currentSlide}
        step={2}
        naturalSlideWidth={250}
        naturalSlideHeight={150}
        hasMasterSpinner
        infinite
      >
        <Box
          sx={{
            display: "flex",
            position: "relative",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Slider>
            {props.images.map((item, index) => (
              <Slide key={index} index={index}>
                <ImageWithZoom
                  src={`http://localhost:5000/${item}`}
                  key={index}
                />
              </Slide>
            ))}
          </Slider>
          <Box sx={{ position: "absolute", top: "45%" }}>
            <ButtonBack
              style={{
                background: "none",
                borderRadius: "50%",
                color: "#1976d2",
                borderColor: "#1976d2",
              }}
              onClick={() => handleClickPreviousEvent()}
            >
              <ArrowBack />
            </ButtonBack>
          </Box>
          <Box sx={{ position: "absolute", top: "45%", right: "0" }}>
            <ButtonNext
              style={{
                background: "none",
                borderRadius: "50%",
                color: "#1976d2",
                borderColor: "#1976d2",
              }}
              onClick={() => handleClickNextEvent()}
            >
              <ArrowForward />
            </ButtonNext>
          </Box>
        </Box>
      </CarouselProvider>
    </Container>
  );
};
