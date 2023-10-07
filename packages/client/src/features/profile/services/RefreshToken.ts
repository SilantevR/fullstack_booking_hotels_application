import { BASE_URL, baseOptions } from "../../../app/api/variables";
import { Method } from "../../../app/api/types";
import { RoutesEnum } from "../../../app/router/types";
import { NavigateFunction } from "react-router-dom";

export const refreshToken = (navigate: NavigateFunction) => {
  const res = fetch(`${BASE_URL}/auth/refresh`, {
    method: Method.POST,
    ...baseOptions,
  }).then((response) => {
    if (response.status !== 200) {
      navigate(RoutesEnum.SignIn);
    }
  });
  return res;
};
