import { Control, FieldErrors, UseFormHandleSubmit } from "react-hook-form";

export interface RoomData {
  _id: string;
  title: string;
  description: string;
  images: string[];
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  hotel?: {
    _id: string;
    title: string;
    description: string;
    images: string[];
  };
}
export interface AddRoomData {
  title: string;
  description: string;
  isEnabled: boolean;
  hotelId: string;
}

export type ValidateRoomData = Pick<AddRoomData, "title" | "description">;

export interface EditRoomProps {
  room: RoomData;
  setRoom: React.Dispatch<React.SetStateAction<RoomData>>;
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
  isEnabled: boolean;
  setIsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}
