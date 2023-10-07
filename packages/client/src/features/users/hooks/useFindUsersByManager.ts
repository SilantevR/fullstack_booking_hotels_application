import { FetchUserData, FetchUsersResult, FindUserData } from "../types";
import { useServerError } from "../../../hooks/useServerError";
import { useNavigate } from "react-router-dom";
import { refreshToken } from "../../profile/services/RefreshToken";
import { findUsersByManager } from "../services/findUsersByManager";

export const useFindUserByManager = () => {
  const navigate = useNavigate();
  const { serverError, setError } = useServerError();
  const onSubmit = (
    data: FindUserData,
    limit: number,
    offset: number,
    setUsers: React.Dispatch<React.SetStateAction<FetchUserData[]>>,
    setCount: React.Dispatch<React.SetStateAction<number>>
  ) => {
    findUsersByManager(limit, offset, data.email, data.name, data.contactPhone)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          refreshToken(navigate).then(() => {
            findUsersByManager(
              limit,
              offset,
              data.email,
              data.name,
              data.contactPhone
            )
              .then((response) => {
                if (response.status === 200) {
                  return response.json();
                }
              })
              .then((result: FetchUsersResult) => {
                if (result) {
                  setUsers(result.result);
                  setCount(result.count);
                }
              });
          });
        } else {
          setError(new Error(`${response.statusText}`));
        }
      })
      .then((result: FetchUsersResult) => {
        if (result) {
          setUsers(result.result);
          setCount(result.count);
        }
      });
  };

  return { onSubmit, serverError, setError };
};
