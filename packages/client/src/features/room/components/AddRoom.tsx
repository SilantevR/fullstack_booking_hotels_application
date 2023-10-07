import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../../components/input/components/Input";
import { validateDescription, validateTitle } from "../../../utils/validation";
import { styles } from "../../../styles";
import { useAddRoomSubmit } from "../hooks/useAddRoomSubmit";
import { ImagesList } from "../../../components/imageList/components/ImagesList";
import { useFileUpload } from "../../../hooks/usefileUpload";

export const AddRoom: React.FC = () => {
  const { id } = useParams();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    mode: "onChange",
  });

  const [isEnabled, setIsEnabled] = useState(true);
  const [images, setImages] = useState([] as string[]);
  const [files, setFiles] = useState([]);

  const { onSubmit, serverError, setError } = useAddRoomSubmit(
    id!,
    isEnabled,
    files
  );

  const { handleFileUpload } = useFileUpload(
    [],
    images,
    files,
    setImages,
    setFiles,
    setError
  );

  return (
    <>
      <Box
        sx={{
          marginTop: "auto",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <Typography
          variant="h5"
          color="primary"
          sx={{
            fontWeight: "bolder",
          }}
          align="center"
        >
          {"Добавление номера"}
        </Typography>
        <FormHelperText
          sx={{
            color: "red",
            fontSize: 16,
          }}
        >
          {serverError}
        </FormHelperText>

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
                onChange={(e) => setIsEnabled(e.target.checked)}
              />
            }
            label="Доступно для бронирования?"
          />
          {files.length < 10 ? (
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={styles.button}
          >
            Создать
          </Button>
        </form>
      </Box>
    </>
  );
};
