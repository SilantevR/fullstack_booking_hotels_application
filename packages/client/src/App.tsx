import { RoutesEnum } from "./app/router/types";
import { ErrorBoundary } from "react-error-boundary";
import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "./components/requireAuth/RequireAuth";
import {
  SignInPage,
  NotFoundPage,
  SignUpPage,
  ServerErrorPage,
  ProfilePage,
  SearchHotelsPage,
  SearchPage,
  AddHotelPage,
  EditHotelPage,
  RoomPage,
  HotelPage,
  UsersPage,
  AddRoomPage,
  EditRoomPage,
  BookingsPage,
  SupportRequestPage,
  SearchSupportRequestPage,
} from "./pages";
import { NavMenu } from "./components/navMenu/components/NavMenu";
import { Container, Box } from "@mui/material";

function App() {
  return (
    <Container sx={{ display: "flex" }}>
      <ErrorBoundary FallbackComponent={ServerErrorPage}>
        <RequireAuth>
          <NavMenu />
          <Box sx={{ flexGrow: "1" }}>
            <Routes>
              <Route index element={<SignInPage />} />
              <Route path="*" element={<NotFoundPage />} />
              <Route path={RoutesEnum.SignUp} element={<SignUpPage />} />
              <Route
                path={RoutesEnum.ServerError}
                element={<ServerErrorPage />}
              />
              <Route path={RoutesEnum.Profile} element={<ProfilePage />} />
              <Route path={RoutesEnum.Search} element={<SearchPage />} />
              <Route
                path={RoutesEnum.Room + RoutesEnum.Id}
                element={<RoomPage />}
              />
              <Route path={RoutesEnum.AddRoom} element={<AddRoomPage />} />
              <Route path={RoutesEnum.EditRoom} element={<EditRoomPage />} />
              <Route path={RoutesEnum.Hotels} element={<SearchHotelsPage />} />
              <Route path={RoutesEnum.AddHotel} element={<AddHotelPage />} />
              <Route
                path={RoutesEnum.EditHotel + RoutesEnum.Id}
                element={<EditHotelPage />}
              />
              <Route
                path={RoutesEnum.Hotel + RoutesEnum.Id}
                element={<HotelPage />}
              />
              <Route path={RoutesEnum.Users} element={<UsersPage />} />
              <Route path={RoutesEnum.Bookings} element={<BookingsPage />} />
              <Route
                path={RoutesEnum.SupportRequest}
                element={<SupportRequestPage /> + RoutesEnum.Id}
              />
              <Route
                path={RoutesEnum.SupportRequests}
                element={<SearchSupportRequestPage />}
              />
            </Routes>
          </Box>
        </RequireAuth>
      </ErrorBoundary>
    </Container>
  );
}

export default App;
