import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  AccountCircle,
  TravelExplore,
  Chat,
  Book,
  MeetingRoom,
  HowToReg,
  AddBusiness,
  OtherHouses,
  ConnectWithoutContact,
  PeopleAlt,
} from "@mui/icons-material";
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { RoutesEnum } from "../../../app/router/types";
import { RouterLinkProps, MyNavLinkProps } from "../types";
import { UserContext } from "../../../components/requireAuth/RequireAuth";

const RouterLink: React.FC<RouterLinkProps> = (props) => {
  const MyNavLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, MyNavLinkProps>(
        (navLinkProps, ref) => {
          const { className: previousClasses, ...rest } = navLinkProps;
          const elementClasses = previousClasses?.toString() ?? "";
          return (
            <NavLink
              {...rest}
              ref={ref}
              to={props.to}
              end
              className={({ isActive }) =>
                isActive ? elementClasses + " Mui-selected" : elementClasses
              }
            />
          );
        }
      ),
    [props.to]
  );
  return (
    <ListItemButton component={MyNavLink}>
      <ListItemIcon
        sx={{
          ".MuiListItemButton-root > &": {
            color: "primary",
          },
          ".Mui-selected > &": { color: "orange" },
        }}
      >
        {props.icon}
      </ListItemIcon>

      <ListItemText
        sx={{
          ".Mui-selected > &": { textDecoration: "underline" },
        }}
      >
        <Typography color="primary">{props.text}</Typography>
      </ListItemText>
    </ListItemButton>
  );
};

export const NavMenu: React.FC = () => {
  const user = useContext(UserContext);

  return (
    <List
      sx={{
        display: "flex",
        flexDirection: "column",
        maxHeight: "500px",
        maxWidth: "300px",
        "& > .MuiListItemButton-root": {
          color: "primary",
        },
        "& > .Mui-selected": { color: "orange" },
      }}
    >
      <RouterLink
        to={RoutesEnum.Search}
        text="Найти номер"
        icon={<TravelExplore />}
      />

      {user.data ? (
        <></>
      ) : (
        <>
          <RouterLink
            to={RoutesEnum.SignIn}
            text="Войти"
            icon={<MeetingRoom />}
          />
          <RouterLink
            to={RoutesEnum.SignUp}
            text="Зарегистрироваться"
            icon={<HowToReg />}
          />
        </>
      )}

      {user.data?.role === "client" ? (
        <>
          <RouterLink
            to={RoutesEnum.Bookings}
            text="Бронирования"
            icon={<Book />}
          />
          <RouterLink
            to={RoutesEnum.SupportRequests}
            text="Техподдержка"
            icon={<ConnectWithoutContact />}
          />
          <RouterLink
            to={RoutesEnum.Profile}
            text="Профиль"
            icon={<AccountCircle />}
          />
        </>
      ) : (
        <></>
      )}

      {user.data?.role === "admin" ? (
        <>
          <RouterLink
            to={RoutesEnum.AddHotel}
            text="Добавить гостиницу"
            icon={<AddBusiness />}
          />
          <RouterLink
            to={RoutesEnum.Hotels}
            text="Все гостиницы"
            icon={<OtherHouses />}
          />
          <RouterLink
            to={RoutesEnum.Users}
            text="Пользователи"
            icon={<PeopleAlt />}
          />
          <RouterLink
            to={RoutesEnum.Profile}
            text="Профиль"
            icon={<AccountCircle />}
          />
        </>
      ) : (
        <></>
      )}
    </List>
  );
};
