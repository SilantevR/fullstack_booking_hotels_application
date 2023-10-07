import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  FormHelperText,
  Container,
  Box,
  Button,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { Input } from "../../../components/input/components/Input";
import { PasswordInput } from "../../../components/passwordInput/components/PasswordInput";
import {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
} from "../../../utils/validation";
import { styles } from "../../../styles";
import { useAddUser } from "../hooks/useAddUser";

export const AddUser: React.FC = () => {
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      name: "",
      role: "",
      contactPhone: "",
      password: "",
      confirm_password: "",
    },
    mode: "onChange",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const { onSubmit, serverError } = useAddUser();

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
          Добавить пользователя
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
          <FormControl fullWidth sx={{ marginTop: "10px" }}>
            <InputLabel id="role-label">Выберите роль</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              label="Выберите роль"
              fullWidth
              onChange={(e) => {
                setValue("role", e.target.value as string);
              }}
            >
              <MenuItem value={"client"}>Клиент</MenuItem>
              <MenuItem value={"manager"}>Менеджер</MenuItem>
              <MenuItem value={"admin"}>Администратор</MenuItem>
            </Select>
          </FormControl>
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
            Создать
          </Button>
        </form>
      </Box>
    </Container>
  );
};
