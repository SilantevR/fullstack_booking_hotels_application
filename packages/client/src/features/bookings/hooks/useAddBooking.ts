import { BookingData } from "../types";
import { useServerError } from "../../../hooks/useServerError";
import { useNavigate } from "react-router-dom";
import { RoutesEnum } from "../../../app/router/types";

import { refreshToken } from "../../profile/services/RefreshToken";
import { addBooking } from "../services/addBooking";

export const useAddBooking = () => {
  const navigate = useNavigate();

  const { serverError, setError } = useServerError();
  const handleAddBooking = (data: BookingData) => {
    addBooking(data)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          refreshToken(navigate).then(() => {
            addBooking(data)
              .then((response) => {
                if (response.status === 200) {
                  return response.json();
                }
              })
              .then((result) => {
                if (result) {
                  navigate(RoutesEnum.ClientBookings);
                }
              });
          });
        } else if (response.status === 409) {
          setError(new Error(`Номер забронирован на выбранные даты`));
        } else {
          setError(new Error(`${response.statusText}`));
        }
      })
      .then((result) => {
        if (result) {
          navigate(RoutesEnum.ClientBookings);
        }
      });
  };

  return { handleAddBooking, serverError };
};
