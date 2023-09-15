import React, { useContext } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ListProfile } from "./ListProfile";
import { styles } from "../styles/styles";
import { logout } from "../services/LogOut";
import { getUser, clearUser } from "../services/authSlice";
import { RoutesEnum } from "../../../app/router/types";
import { useStore, useSet } from "../../../app/store/hooks";
import { UserInformation } from "../types";
import { UserContext } from "../../../components/requireAuth/RequireAuth";

export const Profile: React.FC = () => {
  const set = useSet();
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogOut = () => {
    logout()
      .then((resp) => {
        if (resp.status === 200) {
          set(clearUser());
          navigate(RoutesEnum.SignIn);
        }
      })
      .catch(() => navigate(RoutesEnum.ServerError));
  };

  return (
    <>
      <Container component="main" maxWidth="md">
        <Box sx={styles.boxMain}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bolder",
            }}
            align="center"
            color="primary"
          >
            {user?.data?.name}
          </Typography>
          ;
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <ListProfile label="ID" defaultVal={user?.data?.id} />
            <ListProfile label="Почта" defaultVal={user?.data?.email} />
            <ListProfile label="Имя" defaultVal={user?.data?.name} />
            <ListProfile label="Имя" defaultVal={user?.data?.role} />
            <ListProfile label="Телефон" defaultVal={user?.data?.phone} />
          </Box>
          <Button
            type="button"
            fullWidth
            onClick={handleLogOut}
            variant="contained"
            sx={styles.button}
          >
            Выйти
          </Button>
        </Box>
      </Container>
    </>
  );
};
