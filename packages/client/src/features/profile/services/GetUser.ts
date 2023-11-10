import { BASE_URL, baseOptions } from "../../../app/api/variables";
import { Method } from "../../../app/api/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getUser = {
  fetchData: () => {
    const res = fetch(`${BASE_URL}/auth/user`, {
      method: Method.GET,
      ...baseOptions,
    }).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status !== 200) {
        reject();
      }
    });
    return res;
  },
};

export const fetchGetUser = createAsyncThunk("user", async () => {
  return await getUser.fetchData();
});

export function reject() {
  throw new Error("Пользователь не зарегистрирован");
}
