import { Control, FieldErrors, UseFormHandleSubmit } from "react-hook-form";

export interface FetchHotelData {
  _id: string;
  title: string;
  description: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}
export interface EditHotelData {
  title: string;
  description: string;
  images?: Blob[];
}

export interface FetchHotelsData {
  count: number;
  hotels: FetchHotelData[];
}
export interface EditHotelProps {
  hotel: FetchHotelData;
  setHotel: React.Dispatch<React.SetStateAction<FetchHotelData>>;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  control: Control<
    {
      title: string;
      description: string;
    },
    any
  >;
  errors: FieldErrors<{
    title: string;
    description: string;
  }>;
  handleSubmit: UseFormHandleSubmit<
    {
      title: string;
      description: string;
    },
    undefined
  >;
}

export type HotelData = Pick<FetchHotelData, "title" & "descripton">;

export type UploadImage = string | ArrayBuffer | null;
