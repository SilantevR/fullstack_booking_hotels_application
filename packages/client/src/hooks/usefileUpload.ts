export const useFileUpload = (
  galaryImages: string[],
  images: string[],
  files: never[],
  setImages: React.Dispatch<React.SetStateAction<string[]>>,
  setFiles: React.Dispatch<React.SetStateAction<never[]>>,
  setError: React.Dispatch<React.SetStateAction<Error | undefined>>
) => {
  const handleFileUpload = (event: any) => {
    setError(undefined);
    const filesList = event.target.files;
    const joinedFiles = Array.from(files).concat(Array.from(filesList));
    if (galaryImages.length + joinedFiles.length <= 10) {
      setFiles(joinedFiles);

      const promise = new Promise((resolve, reject) => {
        let uploadImages: string[] = [...images];
        for (let i = 0; i < filesList.length; i++) {
          let reader = new FileReader();
          let file = filesList[i];
          reader.onload = () => {
            if (reader.result) {
              uploadImages.push(reader.result.toString());
            }
            resolve(uploadImages);
          };
          reader.onerror = (error) => {
            reject(error);
          };

          reader.readAsDataURL(file);
        }
      });
      promise
        .then((uploadImages) => {
          setImages(uploadImages as string[]);
        })
        .catch((error) => {
          setError(error);
        });
    } else {
      setError(new Error("Возможна загрузка не более 10 фото"));
    }
  };

  return { handleFileUpload };
};
