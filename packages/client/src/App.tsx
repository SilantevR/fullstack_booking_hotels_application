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
  RoomPage,
  HotelPage,
  AddUserByAdminPage,
  AddRoomPage,
  ClientBookingsPage,
  SupportRequestPage,
  SearchSupportRequestPage,
  AdminUsersPage,
  ManagersSupportRequestsPage,
  ManagersUsersSearchPage,
  ManagersBookingsSearchPage,
  CreateSupportRequestPage,
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
              <Route
                path={RoutesEnum.AddRoom + RoutesEnum.Id}
                element={<AddRoomPage />}
              />
              <Route path={RoutesEnum.Hotels} element={<SearchHotelsPage />} />
              <Route path={RoutesEnum.AddHotel} element={<AddHotelPage />} />

              <Route
                path={RoutesEnum.Hotel + RoutesEnum.Id}
                element={<HotelPage />}
              />
              <Route path={RoutesEnum.Users} element={<AdminUsersPage />} />
              <Route
                path={RoutesEnum.AddUser}
                element={<AddUserByAdminPage />}
              />
              <Route
                path={RoutesEnum.ClientBookings}
                element={<ClientBookingsPage />}
              />
              <Route
                path={RoutesEnum.SupportRequest + RoutesEnum.Id}
                element={<SupportRequestPage />}
              />
              <Route
                path={RoutesEnum.SupportRequests}
                element={<SearchSupportRequestPage />}
              />
              <Route
                path={RoutesEnum.CreateSupportRequest}
                element={<CreateSupportRequestPage />}
              />
              <Route
                path={RoutesEnum.ManagerBookingsSearch}
                element={<ManagersBookingsSearchPage />}
              />
              <Route
                path={RoutesEnum.ManagerUsersSearch}
                element={<ManagersUsersSearchPage />}
              />
              <Route
                path={RoutesEnum.ManagersSupportRequestsBoard}
                element={<ManagersSupportRequestsPage />}
              />
            </Routes>
          </Box>
        </RequireAuth>
      </ErrorBoundary>
    </Container>
  );
}

export default App;
