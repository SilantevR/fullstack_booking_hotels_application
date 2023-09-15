import { BASE_URL, baseOptions } from "../../../app/api/variables";
import { RequestOptions, Method } from "../../../app/api/types";
import { RoutesEnum } from "../../../app/router/types";
import { NavigateFunction } from "react-router-dom";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchGetUser } from "./GetUser";
import { UserData } from "../types";

export const refreshUser = (
  navigate: NavigateFunction,
  set: ThunkDispatch<UserData, undefined, AnyAction>
) => {
  const res = fetch(`${BASE_URL}/auth/refresh`, {
    method: Method.POST,
    ...baseOptions,
  }).then((response) => {
    if (response.status === 200) {
      set(fetchGetUser());
    } else if (response.status !== 200) {
      navigate(RoutesEnum.SignIn);
    }
  });
  return res;
};
