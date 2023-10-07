import React, { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Typography,
  Link as MuiLink,
  FormHelperText,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { validatePassword, validateEmail } from "../../../utils/validation";
import { Input } from "../../../components/input/components/Input";
import { PasswordInput } from "../../../components/passwordInput/components/PasswordInput";
import { RoutesEnum } from "../../../app/router/types";
import { useSignInSubmit } from "../hooks/useSignInSubmit";
import { useValidationRoute } from "../../../hooks/useValidationRoute";
import { styles } from "../../../styles";
import { UserContext } from "../../../components/requireAuth/RequireAuth";

export const SignIn: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  //const user = useStore(getUser);
  const user = useContext(UserContext);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault();
  };

  const { onSubmit, serverError } = useSignInSubmit();

  useValidationRoute(RoutesEnum.Search, user);

  return (
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
        {"Вход"}
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
          flexGrow: 1,
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          name="email"
          control={control}
          rules={validateEmail}
          errors={errors}
          label="Введите Email"
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

        <Button type="submit" fullWidth variant="contained" sx={styles.button}>
          Войти
        </Button>

        <MuiLink
          color="#fff"
          component={RouterLink}
          to={RoutesEnum.SignUp}
          type="button"
          variant="button"
          underline="none"
          sx={styles.link}
        >
          Зарегистрироваться
        </MuiLink>
      </form>
    </Box>
  );
};
