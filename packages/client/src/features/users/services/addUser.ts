import { BASE_URL, baseOptions } from "../../../app/api/variables";
import { RequestOptions, Method } from "../../../app/api/types";
import { AddUserData } from "../types";

export const addUser = (data: AddUserData): Promise<Response> => {
  const requestOptions: RequestOptions = {
    method: Method.POST,
    body: JSON.stringify(data),
  };
  return fetch(`${BASE_URL}/admin/users/`, {
    ...requestOptions,
    ...baseOptions,
  });
};
