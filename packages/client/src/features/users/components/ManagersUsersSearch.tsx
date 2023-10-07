import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FetchUserData, FetchUsersResult } from "../types";
import { refreshToken } from "../../profile/services/RefreshToken";
import { findUsers } from "../services/findUsers";
import { useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import { RoutesEnum } from "../../../app/router/types";
import {
  Box,
  Button,
  Container,
  FormHelperText,
  List,
  Link as MuiLink,
  Pagination,
  Typography,
} from "@mui/material";
import {
  validateEmail,
  validateName,
  validateNotRequiredEmail,
  validateNotRequiredName,
  validatePhone,
} from "../../../utils/validation";
import { styles } from "../../../styles";
import { Search } from "@mui/icons-material";
import { Input } from "../../../components/input/components/Input";
import { UsersListItem } from "./UsersListItem";
import { useFindUser } from "../hooks/useFindUsers";
import { useFindUserByManager } from "../hooks/useFindUsersByManager";

export const ManagersUsersSearch: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: undefined,
      name: undefined,
      contactPhone: undefined,
    },
    mode: "onChange",
  });
  const navigate = useNavigate();
  const [users, setUsers] = useState([] as FetchUserData[]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(10);

  const { serverError, onSubmit, setError } = useFindUserByManager();

  useEffect(() => {
    handleSubmit((data) => {
      onSubmit(data, (page + 1) * limit, page * offset, setUsers, setCount);
    })();
    window.scrollTo(0, 0);
  }, [page]);

  const usersList = users.map((user) => {
    return <UsersListItem key={user._id} user={user} />;
  });

  return (
    <>
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
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bolder",
            }}
            align="center"
          >
            Поиск пользователей
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
            onSubmit={handleSubmit((data) => {
              onSubmit(
                data,
                (page + 1) * limit,
                page * offset,
                setUsers,
                setCount
              );
              setPage(0);
            })}
          >
            <Box sx={{ display: "flex", gap: "10px" }}>
              <Input
                name="email"
                control={control}
                rules={validateNotRequiredEmail}
                errors={errors}
                label="Введите Email"
              />
              <Input
                name="name"
                control={control}
                rules={validateNotRequiredName}
                errors={errors}
                label="Введите Имя"
              />
              <Input
                name="contactPhone"
                control={control}
                rules={validateNotRequiredName}
                errors={errors}
                label="Введите Телефон"
              />
            </Box>
            <Box sx={{ display: "flex", gap: "10px" }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={styles.button}
              >
                <Search sx={{ marginRight: "10px" }} />
                Найти
              </Button>
              <MuiLink
                color="#fff"
                component={RouterLink}
                to={RoutesEnum.AddUser}
                type="button"
                variant="button"
                underline="none"
                sx={styles.link}
              >
                Добавить
              </MuiLink>
            </Box>
          </form>
        </Box>
      </Container>

      <List sx={{ width: "100%" }}>{usersList}</List>
      <Pagination
        count={count % limit ? Math.ceil(count / limit) : count / limit}
        page={page + 1}
        onChange={(e, value) => {
          setPage(value - 1);
        }}
        color="secondary"
        variant="outlined"
        shape="rounded"
      />
    </>
  );
};
