import { search } from "../services/Search";
import { SearchDates, SearchData } from "../types";
import { useServerError } from "../../../hooks/useServerError";

export const useSearchSubmit = () => {
  const { serverError, setError } = useServerError();
  const onSubmit = (
    data: SearchData,
    dates: SearchDates,
    setResults: React.Dispatch<[]>,
    setOpen: React.Dispatch<boolean>
  ) => {
    search(data, dates)
      .then((response) => {
        if (response.status === 200) {
          setError(undefined);
          return response.json();
        } else {
          setError(new Error(`${response.statusText}`));
        }
      })
      .then((result) => {
        if (!result.length) {
          setError(new Error(`По вашему запросу ничего не найдено`));
        }
        setOpen(false);

        setResults(result);
      })
      .catch(setError);
  };

  return { onSubmit, serverError };
};
