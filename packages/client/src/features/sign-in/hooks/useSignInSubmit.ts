import { signin } from "../services/SignIn";
import { SignInData } from "../types";
import { useServerError } from "../../../hooks/useServerError";
import { useNavigate } from "react-router-dom";
import { RoutesEnum } from "../../../app/router/types";

export const useSignInSubmit = () => {
  const navigate = useNavigate();
  const { serverError, setError } = useServerError();
  const onSubmit = (data: SignInData) => {
    signin(data)
      .then((response) => {
        if (response.status === 200) {
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
