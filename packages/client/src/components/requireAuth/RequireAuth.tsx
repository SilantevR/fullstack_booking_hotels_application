import React, { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../features/profile/services/authSlice";
import { useStore, useSet } from "../../app/store/hooks";
import { fetchGetUser } from "../../features/profile/services/GetUser";
import { refreshUser } from "../../features/profile/services/RefreshUser";
import { createContext } from "react";
import { initialState } from "../../features/profile/services/authSlice";

export const UserContext = createContext(initialState);

export const RequireAuth: React.FC<PropsWithChildren> = ({ children }) => {
  const user = useStore(getUser);
  const set = useSet();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.status !== "success") {
      set(fetchGetUser());
    }
  }, []);

  useEffect(() => {
    if (user.status === "error") {
      refreshUser(navigate, set);
    }
  }, [user.status]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
