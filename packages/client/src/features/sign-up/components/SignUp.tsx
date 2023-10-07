import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FormHelperText,
  Container,
  Box,
  Button,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Input } from "../../../components/input/components/Input";
import { PasswordInput } from "../../../components/passwordInput/components/PasswordInput";
import {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
} from "../../../utils/validation";
import { RoutesEnum } from "../../../app/router/types";
import { useStore } from "../../../app/store/hooks";
import { getUser } from "../../profile/services/authSlice";
import { useSignUpSubmit } from "../hooks/useSignUpSubmit";
import { useValidationRoute } from "../../../hooks/useValidationRoute";
import { styles } from "../../../styles";

export const SignUp: React.FC = () => {
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      password: "",
      confirm_password: "",
    },
    mode: "onChange",
  });

  const user = useStore(getUser);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const { onSubmit, serverError } = useSignUpSubmit();

  useValidationRoute(RoutesEnum.Search, user);

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
          Создать профиль
        </Typography>
        <FormHelperText
          sx={{
            color: "red",
            fontSize: 16,
          }}
        >
          {serverError}
        </FormHelperText>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            name="email"
            control={control}
            rules={validateEmail}
            errors={errors}
            label="Введите Email"
          />
          <Input
            name="name"
            control={control}
            rules={validateName}
            errors={errors}
            label="Введите Имя"
          />
          <Input
            name="phone"
            control={control}
            rules={validatePhone}
            errors={errors}
            label="Введите Телефон"
          />
          <PasswordInput
            name="password"
            control={control}
            rules={validatePassword}
            errors={errors}
            label="Введите Пароль"
            handleShow={showPassword}
            handleClick={handleClickShowPassword}
            handleMouseDown={handleMouseDownPassword}
          />
          <PasswordInput
            name="confirm_password"
            control={control}
            rules={{
              required: "⚠ Поле не может быть пустым",
              validate: (value: string) => {
                if (watch("password") != value) {
                  return "⚠ Пароли не совпадают";
                }
              },
            }}
            errors={errors}
            label="Повторите Пароль"
            handleShow={showPassword}
            handleClick={handleClickShowPassword}
            handleMouseDown={handleMouseDownPassword}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={styles.button}
          >
            Создать аккаунт
          </Button>
          <MuiLink
            color="#fff"
            component={RouterLink}
            to={RoutesEnum.SignIn}
            type="button"
            variant="button"
            underline="none"
            sx={styles.link}
          >
            Войти
          </MuiLink>
        </form>
      </Box>
    </Container>
  );
};
