import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ImageCardProps } from "../types";
import { IconButton, ImageListItemBar, ListItem } from "@mui/material";
import { HighlightOff } from "@mui/icons-material";
import { PUBLIC_URL } from "../../../app/api/variables";

export const ImageCard: React.FC<ImageCardProps> = ({
  src,
  index,
  moveImage,
  handleImageRemove,
}) => {
  const ref = useRef<HTMLImageElement>(null);

  const [, drop] = useDrop({
    accept: "image",
    hover: (item: any, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveImage(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "image",
    item: () => {
      return { index };
    },
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <ListItem sx={{ cursor: "pointer", maxWidth: "220px", opacity }}>
      <div ref={ref} style={{ position: "relative" }} className="card">
        <ImageListItemBar
          sx={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
              "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
          }}
          position="top"
          actionIcon={
            <IconButton
              sx={{ color: "white" }}
              onClick={() => {
                handleImageRemove(index, src);
              }}
            >
              <HighlightOff />
            </IconButton>
          }
          actionPosition="left"
        />
        <img
          src={`${PUBLIC_URL + "/" + src}`}
          alt="Фото отеля"
          height="100"
          width="200"
        />
      </div>
    </ListItem>
  );
};
