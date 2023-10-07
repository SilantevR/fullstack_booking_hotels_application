import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FormHelperText,
  Container,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { Input } from "../../../components/input/components/Input";
import { validateDescription } from "../../../utils/validation";
import { styles } from "../../../styles";
import { useServerError } from "../../../hooks/useServerError";
import { createSupportRequest } from "../services/createSupportRequest";
import { refreshToken } from "../../profile/services/RefreshToken";
import { useNavigate } from "react-router-dom";
import { RoutesEnum } from "../../../app/router/types";
import { MessageData } from "../types";

export const CreateSupportRequest: React.FC = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      text: "",
    },
    mode: "onChange",
  });
  const navigate = useNavigate();

  const { serverError, setError } = useServerError();

  const handleCreateSR = (data: MessageData) => {
    createSupportRequest(data)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          refreshToken(navigate).then(() => {
            createSupportRequest(data)
              .then((response) => {
                if (response.status === 200) {
                  return response.json();
                }
              })
              .then((result) => {
                if (result) {
                  navigate(RoutesEnum.SupportRequests);
                }
              });
          });
        } else {
          setError(new Error(`${response.statusText}`));
        }
      })
      .then((result) => {
        if (result) {
          navigate(RoutesEnum.SupportRequests);
        }
      });
  };

  return (
    <Container
      component="main"
      maxWidth="xl"
      sx={{
        display: "flex",
      }}
    >
      <Box
        sx={{
          margin: "auto",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "400px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bolder",
          }}
          color="primary"
          align="center"
        >
          Обращение в техподдержку
        </Typography>
        <FormHelperText
          sx={{
            color: "red",
            fontSize: 16,
          }}
        >
          {serverError}
        </FormHelperText>
        <form onSubmit={handleSubmit(handleCreateSR)}>
          <Input
            name="text"
            control={control}
            rules={validateDescription}
            multiline={true}
            errors={errors}
            label="Введите текст обращения"
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
    </Container>
  );
};
