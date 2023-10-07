import { AddUserData} from "../types";
import { useServerError } from "../../../hooks/useServerError";
import { useNavigate } from "react-router-dom";
import { RoutesEnum } from "../../../app/router/types";
import { refreshToken } from "../../profile/services/RefreshToken";
import { addUser } from "../services/addUser";

export const useAddUser = () => {
  const navigate = useNavigate();

  const { serverError, setError } = useServerError();
  const onSubmit = (data: AddUserData) => {
    addUser(data)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          refreshToken(navigate).then(() => {
            addUser(data)
              .then((response) => {
                if (response.status === 200) {
                  return response.json();
                }
              })
              .then((result) => {
                if (result) {
                  navigate(RoutesEnum.Users);
                }
              });
          });
        } else {
          setError(new Error(`${response.statusText}`));
        }
      })
      .then((result) => {
        if (result) {
          navigate(RoutesEnum.Users);
        }
      });
  };

  return { onSubmit, serverError };
};
