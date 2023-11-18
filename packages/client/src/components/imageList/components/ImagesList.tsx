import React, { useState } from "react";
import { ImageItem } from "./ImageItem";
import { List } from "@mui/material";
import { LightBox } from "../../../components/lightboxGalery/components/LightBox";

export const ImagesList: React.FC<{ images: string[]; url?: string }> = ({
  images,
  url,
}) => {
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

  const list = images.map((result, index) => (
    <ImageItem
      url={url ?? ""}
      key={index}
      index={index}
      result={result}
      openLightBox={openLightbox}
    />
  ));

  return (
    <>
      <List sx={{ display: "flex", flexWrap: "wrap" }}>{list}</List>
      <LightBox
        images={images}
        state={state}
        setState={setState}
        url={url ? `${url}/` : ""}
      />
    </>
  );
};
