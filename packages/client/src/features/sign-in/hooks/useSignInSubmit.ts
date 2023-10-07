import { signin } from "../services/SignIn";
import { SignInData } from "../types";
import { useServerError } from "../../../hooks/useServerError";
import { useNavigate } from "react-router-dom";
import { RoutesEnum } from "../../../app/router/types";
import { getUser } from "../../profile/services/authSlice";
import { useSet } from "../../../app/store/hooks";
import { fetchGetUser } from "../../profile/services/GetUser";

export const useSignInSubmit = () => {
  const set = useSet();
  const navigate = useNavigate();
  const { serverError, setError } = useServerError();
  const onSubmit = (data: SignInData) => {
    signin(data)
      .then((response) => {
        if (response.status === 200) {
          set(fetchGetUser());
          navigate(RoutesEnum.Search);
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
