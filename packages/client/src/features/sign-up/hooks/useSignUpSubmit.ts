import { SignUpData } from "../types";
import { signup } from "../services/SignUp";
import { useSet } from "../../../app/store/hooks";
import { fetchGetUser } from "../../profile/services/GetUser";
import { useServerError } from "../../../hooks/useServerError";
import { useNavigate } from "react-router-dom";
import { RoutesEnum } from "../../../app/router/types";

export const useSignUpSubmit = () => {
  const set = useSet();
  const navigate = useNavigate();
  const { serverError, setError } = useServerError();
  const onSubmit = (data: SignUpData) => {
    signup(data)
      .then((response) => {
        if (response.status === 200) {
          set(fetchGetUser());
          navigate(RoutesEnum.Profile);
        } else {
          return response.json();
        }
      })
      .then((result) => {
        setError(new Error(`${result.message}`));
      })
      .catch(setError);
  };

  return { onSubmit, serverError };
};
