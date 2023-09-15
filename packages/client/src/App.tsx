import React, { useState } from "react";
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
} from "./pages";

function App() {
  return (
    <ErrorBoundary FallbackComponent={ServerErrorPage}>
      <RequireAuth>
        <Routes>
          <Route index element={<SignInPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path={RoutesEnum.SignUp} element={<SignUpPage />} />
          <Route path={RoutesEnum.ServerError} element={<ServerErrorPage />} />
          <Route
            path={RoutesEnum.Profile}
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
        </Routes>
      </RequireAuth>
    </ErrorBoundary>
  );
}

export default App;
