import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../features/profile/types";

export const useValidationRoute = (path: string, user: UserData) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user.data) {
      navigate(path);
    }
  }, [user.data]);
};
