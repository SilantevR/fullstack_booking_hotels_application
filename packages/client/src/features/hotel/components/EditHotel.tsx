import React, { useState } from "react";
import { Input } from "../../../components/input/components/Input";
import { validateDescription, validateTitle } from "../../../utils/validation";
import { useEditHotelSubmit } from "../hooks/useEditHotelSubmit";
import { Button, FormHelperText } from "@mui/material";
import { ImagesList } from "../../../components/imageList/components/ImagesList";
import { EditHotelProps } from "../types";
import { styles } from "../../../styles";
import { GalaryDragAndDrop } from "../../../components/galeryDragAndDrop/components/GaleryDragAndDrop";
import { removeImage } from "../services/removeImage";
import { useFileUpload } from "../../../hooks/usefileUpload";
import { refreshToken } from "../../profile/services/RefreshToken";
import { useNavigate } from "react-router-dom";

export const EditHotel: React.FC<EditHotelProps> = ({
  hotel,
  setHotel,
  setEdit,
  control,
  errors,
  handleSubmit,
}) => {
  const [galaryImages, setGalaryImages] = React.useState(hotel.images ?? []);
  const [images, setImages] = useState([] as string[]);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const { onSubmit, serverError, setError } = useEditHotelSubmit(
    files,
    setHotel,
    setEdit,
    setImages,
    setFiles,
    hotel._id,
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

    removeImage({ ...hotel, images: newGalaryImages }, src)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          refreshToken(navigate).then(() => {
            removeImage({ ...hotel, images: newGalaryImages }, src)
              .then((response) => {
                if (response.status === 200) {
                  return response.json();
                }
              })
              .then((result) => {
                if (result) {
                  setHotel(result);
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
          setHotel(result);
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
          //value={hotel.title}
          rules={validateTitle}
          errors={errors}
          label="Введите Название"
        />
        <Input
          name="description"
          control={control}
          //value={hotel.description}
          rules={validateDescription}
          errors={errors}
          multiline={true}
          label="Введите Описание"
        />
        {hotel.images?.length ? (
          <GalaryDragAndDrop
            galaryImages={galaryImages}
            setGalaryImages={setGalaryImages}
            handleImageRemove={handleImageRemove}
          />
        ) : (
          <></>
        )}
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
