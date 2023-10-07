import React from "react";

export type lightBoxGaleryProps = React.PropsWithChildren<{
  images: string[];
}>;

export type lightBoxProps = React.PropsWithChildren<{
  images: string[];
  url: string;
  setState: React.Dispatch<
    React.SetStateAction<{
      currentImage: number;
      lightBoxIsOpen: boolean;
    }>
  >;
  state: {
    currentImage: number;
    lightBoxIsOpen: boolean;
  };
}>;
