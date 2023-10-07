import React, { useState, useEffect } from "react";
import { FetchUserData } from "../types";
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
  validateNotRequiredEmail,
  validateNotRequiredName,
  validateNotRequiredPhone,
} from "../../../utils/validation";
import { styles } from "../../../styles";
import { Search } from "@mui/icons-material";
import { Input } from "../../../components/input/components/Input";
import { UsersListItem } from "./UsersListItem";
import { useFindUser } from "../hooks/useFindUsers";

export const UsersList: React.FC = () => {
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
  const [users, setUsers] = useState([] as FetchUserData[]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(10);

  const { serverError, onSubmit, setError } = useFindUser();

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
              rules={validateNotRequiredPhone}
              errors={errors}
              label="Введите Телефон"
            />

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
              Добавить пользователя
            </MuiLink>
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
