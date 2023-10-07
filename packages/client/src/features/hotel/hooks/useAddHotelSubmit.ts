import { HotelData } from "../types";
import { useServerError } from "../../../hooks/useServerError";
import { useNavigate } from "react-router-dom";
import { RoutesEnum } from "../../../app/router/types";
import { addHotel } from "../services/addHotel";
import { refreshToken } from "../../profile/services/RefreshToken";

export const useAddHotelSubmit = () => {
  const navigate = useNavigate();

  const { serverError, setError } = useServerError();
  const onSubmit = (data: HotelData) => {
    addHotel(data)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          refreshToken(navigate).then(() => {
            addHotel(data)
              .then((response) => {
                if (response.status === 200) {
                  return response.json();
                }
              })
              .then((result) => {
                if (result) {
                  navigate(RoutesEnum.Hotel + "/" + `${result.id}`);
                }
              });
          });
        } else {
          setError(new Error(`${response.statusText}`));
        }
      })
      .then((result) => {
        if (result) {
          navigate(RoutesEnum.Hotel + "/" + `${result.id}`);
        }
      });
  };

  return { onSubmit, serverError };
};
