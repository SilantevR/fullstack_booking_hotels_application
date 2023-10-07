import { search } from "../services/search";
import { SearchDates, SearchData } from "../types";
import { useServerError } from "../../../hooks/useServerError";

export const useSearchSubmit = () => {
  const { serverError, setError } = useServerError();
  const onSubmit = (
    data: SearchData,
    dates: SearchDates,
    limit: number,
    offset: number,
    setResults: React.Dispatch<[]>,
    setOpen: React.Dispatch<boolean>,
    setCount: React.Dispatch<React.SetStateAction<number>>
  ) => {
    search(data, dates, limit, offset)
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
        setError(undefined);
        setOpen(false);
        setResults(result.result);
        setCount(result.count);
      })
      .catch(setError);
  };

  return { onSubmit, serverError };
};
