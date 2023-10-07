import { RoomData } from "../types";

import { useServerError } from "../../../hooks/useServerError";
import { useNavigate } from "react-router-dom";
import { refreshToken } from "../../profile/services/RefreshToken";
import { editRoom } from "../services/editRoom";

export const useEditRoomSubmit = (
  images: Blob[],
  setRoom: React.Dispatch<React.SetStateAction<RoomData>>,
  setEdit: React.Dispatch<React.SetStateAction<boolean>>,
  setImages: React.Dispatch<React.SetStateAction<string[]>>,
  setFiles: React.Dispatch<React.SetStateAction<never[]>>,
  id: string,

  createdAt: string,
  isEnabled: boolean,
  oldImages: string[] | undefined
) => {
  const navigate = useNavigate();
  const { serverError, setError } = useServerError();
  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("isEnabled", isEnabled.toString());
    formData.append("createdAt", createdAt);
    formData.append("images", JSON.stringify(oldImages ?? []));

    for (let image of images) {
      formData.append("image", image, image.type);
    }

    editRoom(id, formData)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          refreshToken(navigate).then(() => {
            editRoom(id, formData)
              .then((response) => {
                if (response.status === 200) {
                  return response.json();
                }
              })
              .then((result) => {
                if (result) {
                  setRoom(result);
                  setEdit(false);
                  setImages([]);
                  setFiles([]);
                }
              });
          });
        } else {
          setError(new Error(`${response.statusText}`));
        }
      })
      .then((result) => {
        if (result) {
          setRoom(result);
          setEdit(false);
          setImages([]);
          setFiles([]);
        }
      });
  };

  return { onSubmit, serverError, setError };
};
