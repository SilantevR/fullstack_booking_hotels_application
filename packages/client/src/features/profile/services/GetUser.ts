import { BASE_URL, baseOptions } from "../../../app/api/variables";
import { Method } from "../../../app/api/types";
import * as toolkitRaw from "@reduxjs/toolkit";
const { createAsyncThunk } = ((toolkitRaw as any).default ??
  toolkitRaw) as typeof toolkitRaw;

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
