import { useServerError } from "../../../hooks/useServerError";
import { useNavigate } from "react-router-dom";
import { RoutesEnum } from "../../../app/router/types";
import { AddRoomData, RoomData, ValidateRoomData } from "../types";
import { addRoom } from "../services/addRoom";
import { refreshUser } from "../../profile/services/RefreshUser";
import { useSet } from "../../../app/store/hooks";
import { refreshToken } from "../../profile/services/RefreshToken";

export const useAddRoomSubmit = (
  hotelId: string,
  isEnabled: boolean,
  images: Blob[]
) => {
  const set = useSet();
  const navigate = useNavigate();
  const { serverError, setError } = useServerError();
  const onSubmit = (data: ValidateRoomData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("isEnabled", isEnabled.toString());
    formData.append("hotelId", hotelId);
    for (let image of images) {
      formData.append("image", image, image.type);
    }
    addRoom(formData)
      .then((response) => {
        console.log(response.status);
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          refreshToken(navigate).then(() => {
            addRoom(formData)
              .then((response) => {
                if (response.status === 200) {
                  return response.json();
                }
              })
              .then((result) => {
                if (result) {
                  navigate(RoutesEnum.Room + "/" + `${result._id}`);
                }
              });
          });
        } else {
          setError(new Error(`${response.statusText}`));
        }
      })
      .then((result: RoomData) => {
        if (result) {
          navigate(RoutesEnum.Room + "/" + `${result._id}`);
        }
      });
  };

  return { onSubmit, serverError, setError };
};
