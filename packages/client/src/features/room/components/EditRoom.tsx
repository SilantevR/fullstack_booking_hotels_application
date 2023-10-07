import React, { useState } from "react";
import { EditRoomProps } from "../types";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFileUpload } from "../../../hooks/usefileUpload";
import { refreshToken } from "../../profile/services/RefreshToken";
import { GalaryDragAndDrop } from "../../../components/galeryDragAndDrop/components/GaleryDragAndDrop";
import { validateDescription, validateTitle } from "../../../utils/validation";
import { Input } from "../../../components/input/components/Input";
import { styles } from "../../../styles";
import { ImagesList } from "../../../components/imageList/components/ImagesList";
import { useEditRoomSubmit } from "../hooks/useEditRoomSubmit";
import { removeRoomImage } from "../services/removeRoomImage";

export const EditRoom: React.FC<EditRoomProps> = ({
  room,
  setRoom,
  setEdit,
  control,
  errors,
  handleSubmit,
  isEnabled,
  setIsEnabled,
}) => {
  const [galaryImages, setGalaryImages] = React.useState(room.images ?? []);
  const [images, setImages] = useState([] as string[]);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const { onSubmit, serverError, setError } = useEditRoomSubmit(
    files,
    setRoom,
    setEdit,
    setImages,
    setFiles,
    room._id,
    room.createdAt,
    isEnabled,
    galaryImages
  );
  const { handleFileUpload } = useFileUpload(
    galaryImages,
    images,
    files,
    setImages,
    setFiles,
    setError
  );

  const handleImageRemove = (index: number, src: string) => {
    const newGalaryImages = [...galaryImages];
    newGalaryImages.splice(index, 1);
    setGalaryImages(newGalaryImages);

    removeRoomImage({ ...room, isEnabled, images: newGalaryImages }, src)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          refreshToken(navigate).then(() => {
            removeRoomImage(
              { ...room, isEnabled, images: newGalaryImages },
              src
            )
              .then((response) => {
                if (response.status === 200) {
                  return response.json();
                }
              })
              .then((result) => {
                if (result) {
                  setRoom(result);
                }
              });
          });
        } else {
          setError(new Error(`${response.statusText}`));
          setEdit(false);
        }
      })
      .then((result) => {
        if (result) {
          setRoom(result);
        }
      });
  };

  return (
    <>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "90%",
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          name="title"
          control={control}
          rules={validateTitle}
          errors={errors}
          label="Введите Название"
        />
        <Input
          name="description"
          control={control}
          rules={validateDescription}
          errors={errors}
          multiline={true}
          label="Введите Описание"
        />
        <FormControlLabel
          name="isEnabled"
          control={
            <Checkbox
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked ? true : false)}
            />
          }
          label="Доступно для бронирования?"
        />

        {room.images?.length ? (
          <GalaryDragAndDrop
            galaryImages={galaryImages}
            setGalaryImages={setGalaryImages}
            handleImageRemove={handleImageRemove}
          />
        ) : null}

        <FormHelperText
          sx={{
            color: "red",
            fontSize: 16,
          }}
        >
          {serverError}
        </FormHelperText>
        {galaryImages.length + files.length < 10 ? (
          <label htmlFor="upload-image">
            <Button variant="contained" component="span">
              Upload
            </Button>
            <input
              id="upload-image"
              hidden
              accept="image/*"
              type="file"
              multiple={true}
              onChange={(e) => {
                handleFileUpload(e);
              }}
            />
          </label>
        ) : (
          <></>
        )}

        <ImagesList images={images} />

        <Button type="submit" fullWidth variant="contained" sx={styles.button}>
          Сохранить
        </Button>
        <Button
          type="button"
          fullWidth
          variant="contained"
          sx={styles.button}
          onClick={() => {
            setEdit(false);
          }}
        >
          Отменить
        </Button>
      </form>
    </>
  );
};
