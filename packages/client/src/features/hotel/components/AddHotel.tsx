import React from "react";
import { useForm } from "react-hook-form";
import { useAddHotelSubmit } from "../hooks/useAddHotelSubmit";
import { Box, Button, FormHelperText, Typography } from "@mui/material";
import { Input } from "../../../components/input/components/Input";
import { styles } from "../../../styles";
import { validateDescription, validateTitle } from "../../../utils/validation";

export const AddHotel: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    mode: "onChange",
  });

  const { onSubmit, serverError } = useAddHotelSubmit();

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
          {"Добавление гостиницы"}
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
