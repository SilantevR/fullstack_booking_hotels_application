import React, { useCallback } from "react";
import { GalaryDragAndDropProps } from "../types";
import { ImageCard } from "./ImageCard";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { List } from "@mui/material";

export const GalaryDragAndDrop: React.FC<GalaryDragAndDropProps> = ({
  galaryImages,
  setGalaryImages,
  handleImageRemove,
}) => {
  const moveImage = useCallback((dragIndex: number, hoverIndex: number) => {
    setGalaryImages((prevCards) => {
      const clonedCards = [...prevCards];
      const removedItem = clonedCards.splice(dragIndex, 1)[0];

      clonedCards.splice(hoverIndex, 0, removedItem);
      return clonedCards;
    });
  }, []);
  return (
    <DndProvider backend={HTML5Backend}>
      <List sx={{ display: "flex", flexWrap: "wrap" }}>
        {React.Children.toArray(
          galaryImages!.map((image, index) => (
            <ImageCard
              src={image}
              index={index}
              moveImage={moveImage}
              handleImageRemove={handleImageRemove}
            />
          ))
        )}
      </List>
    </DndProvider>
  );
};
